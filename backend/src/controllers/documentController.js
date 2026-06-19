/**
 * Controlador de Documentos e Pastas Virtuais.
 *
 * Responsável por:
 * - Criação e eliminação de pastas virtuais (registos na BD com file_path='folder').
 * - Upload, listagem, atualização e eliminação (soft) de documentos/ficheiros.
 * - Restauro de documentos previamente eliminados.
 * - Controlo de acesso por empresa (IDOR check via company_id).
 *
 * Modelo de dados:
 * - Document: representa tanto ficheiros como pastas virtuais.
 *   Pastas usam file_path='folder'; ficheiros usam o caminho real no disco.
 * - parent_document_id: permite estrutura hierárquica (pastas dentro de pastas).
 *
 * Fluxo:
 * Frontend (upload/gestão) -> API (este controlador) -> Multer (ficheiros) -> Base de Dados (Document) -> Resposta JSON.
 */
const { Document } = require('../models');
const fs = require('fs');
const auditLogService = require('../services/auditLogService');

const documentController = {
    // Cria uma pasta virtual na base de dados (sem ficheiro físico no disco).
    async createFolder(req, res) {
        try {
            const { name, company_id, parent_document_id } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Folder name is required.' });
            }

            const uploaded_by_user_id = req.user?.id || 1;
            const user_company_id = req.user?.company_id || 1;

            // Cria o registo da pasta na BD com file_path='folder' como marcador de tipo.
            const newFolder = await Document.create({
                company_id: company_id || user_company_id,
                uploaded_by_user_id,
                document_category: 'Other', 
                title: name,                 
                file_path: 'folder',         
                is_action_required: false,
                status: 'Informational',
                parent_document_id: parent_document_id || null
            });

            // Registo de auditoria com padrão fail-safe: se o log falhar, a pasta já foi criada com sucesso.
            try {
                if (auditLogController && typeof auditLogController.logEvent === 'function') {
                    await auditLogController.logEvent({
                        user_id: uploaded_by_user_id,
                        action: 'FOLDER_CREATE',
                        entity_type: 'Document',
                        entity_id: newFolder.id,
                        ip_address: req.ip
                    });
                } else {
                    console.warn("⚠️ Alerta: auditLogController ou logEvent não estão disponíveis, mas a pasta foi criada.");
                }
            } catch (logError) {
                console.error("❌ Falha segura ao registar log de auditoria:", logError);
            }

            return res.status(201).json({ message: 'Folder created successfully!', document: newFolder });

        } catch (error) {
            console.error('❌ ERRO REAL AO CRIAR PASTA:', error);
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company or parent document does not exist.' });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Elimina uma pasta virtual. Valida que o registo é de facto uma pasta (file_path='folder') antes de eliminar.
    async deleteFolder(req, res) {
        try {
            const { id } = req.params;

            const folder = await Document.findByPk(id);

            if (!folder) {
                return res.status(404).json({ error: 'Folder not found.' });
            }

            // Impede a eliminação acidental de ficheiros através desta rota de pastas.
            if (folder.file_path !== 'folder') {
                return res.status(400).json({ error: 'This item is a file, not a folder.' });
            }

            const uploaded_by_user_id = req.user?.id || 1;

            await folder.destroy();

            // Registo de auditoria com padrão fail-safe.
            try {
                if (auditLogController && typeof auditLogController.logEvent === 'function') {
                    await auditLogController.logEvent({
                        user_id: uploaded_by_user_id,
                        action: 'FOLDER_DELETE',
                        entity_type: 'Document',
                        entity_id: id,
                        ip_address: req.ip
                    });
                }
            } catch (logError) {
                console.error("⚠️ Falha segura ao registar log de eliminação:", logError);
            }

            return res.status(200).json({ message: 'Folder deleted successfully!' });

        } catch (error) {
            console.error('❌ ERRO AO ELIMINAR PASTA:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Faz upload de um documento (ficheiro físico via Multer) e regista os metadados na BD.
    async create(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No document file provided.' });
            }

            const uploaded_by_user_id = req.user.id; 
            
            const { 
                company_id, 
                document_category, 
                title, 
                is_action_required, 
                status, 
                parent_document_id 
            } = req.body;

            const file_path = `uploads/${req.file.filename}`;

            const newDocument = await Document.create({
                company_id,
                uploaded_by_user_id,
                document_category,
                title,
                file_path,
                // Converte string "true" do form-data para booleano.
                is_action_required: is_action_required === 'true' || is_action_required === true,
                status: status || 'Informational',
                parent_document_id: parent_document_id || null
            });

            // Regista o upload do documento no log de auditoria.
            await auditLogService.logEvent({
                user_id: uploaded_by_user_id,
                action: 'DOCUMENT_CREATE',
                entity_type: 'Document',
                entity_id: newDocument.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Document uploaded successfully!', document: newDocument });
        } catch (error) {
            // Se o registo na BD falhar, remove o ficheiro físico do disco para evitar ficheiros órfãos.
            if (req.file && fs.existsSync(req.file.path)){
                fs.unlinkSync(req.file.path);
            }
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company or parent document does not exist.' });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }
            console.error('Upload Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista todos os documentos da empresa do utilizador autenticado, ordenados do mais recente ao mais antigo.
    async findAll(req, res) {
        try {
            let whereClause = {};
            // Filtra por empresa se o utilizador estiver associado a uma (clientes). Admins sem empresa veem todos.
            if (req.user.company_id) {
                whereClause.company_id = req.user.company_id;
            }

            const documents = await Document.findAll({ 
                where: whereClause,
                order: [['createdAt', 'DESC']] 
            });
            return res.status(200).json(documents);
        } catch (error) {
            console.error('Find All Documents error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Atualiza os metadados de um documento (título, categoria, estado). Não altera o ficheiro físico.
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, document_category, status } = req.body;

            const document = await Document.findByPk(id);
            if (!document) return res.status(404).json({ error: 'Document not found.' });

            // Prevenção IDOR: impede que utilizadores de uma empresa acedam a documentos de outra.
            if (req.user.company_id && document.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await document.update({ title, document_category, status });

            // Regista a atualização do documento no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'DOCUMENT_UPDATE',
                entity_type: 'Document',
                entity_id: document.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Document details updated!', document });
        } catch (error) {
            console.error('Update Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Eliminação suave (soft delete) de um documento. O registo é mantido na BD com deletedAt preenchido.
    async delete(req, res) {
        try {
            const { id } = req.params;
            const document = await Document.findByPk(id);
            
            if (!document) return res.status(404).json({ error: 'Document not found.' });

            // Prevenção IDOR: impede eliminação de documentos de outras empresas.
            if (req.user.company_id && document.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await document.destroy();

            // Regista a eliminação do documento no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'DOCUMENT_DELETE',
                entity_type: 'Document',
                entity_id: document.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Document deleted successfully!' });
        } catch (error) {
            console.error('Delete Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Restaura um documento previamente eliminado (soft delete). Usa paranoid: false para encontrar registos eliminados.
    async restore(req, res) {
        try {
            const { id } = req.params;
            const document = await Document.findByPk(id, { paranoid: false });
            
            if (!document) return res.status(404).json({ error: 'Document not found.' });
            
            // Prevenção IDOR: impede restauro de documentos de outras empresas.
            if (req.user.company_id && document.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            if (document.deletedAt === null) return res.status(400).json({ error: 'This document is already active.' });

            await document.restore();

            // Regista o restauro do documento no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'DOCUMENT_RESTORE',
                entity_type: 'Document',
                entity_id: document.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Document restored successfully!', document });
        } catch (error) {
            console.error('Restore Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = documentController;