const { Document } = require('../models');
const fs = require('fs');
const auditLogService = require('../services/auditLogService');

const documentController = {
    // ROTA NOVA: MÉTODOS PARA CRIAR PASTA VIRTUAL
    async createFolder(req, res) {
        try {
            const { name, company_id, parent_document_id } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Folder name is required.' });
            }

            const uploaded_by_user_id = req.user?.id || 1;
            const user_company_id = req.user?.company_id || 1;

            // 1. Cria a pasta primeiro (Ação Principal)
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

            // 2. Tenta gravar o Log. Se o sistema de logs falhar, NÃO deita a app abaixo!
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
                // Não fazemos return aqui, deixamos o código continuar para o utilizador receber o sucesso da pasta!
            }

            // 3. Resposta de Sucesso total
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

    // ROTA NOVA: ELIMINAR PASTA VIRTUAL
    async deleteFolder(req, res) {
        try {
            const { id } = req.params;

            // 1. Procurar se a pasta existe
            const folder = await Document.findByPk(id);

            if (!folder) {
                return res.status(404).json({ error: 'Folder not found.' });
            }

            // Garantir que é mesmo uma pasta que estamos a tentar eliminar
            if (folder.file_path !== 'folder') {
                return res.status(400).json({ error: 'This item is a file, not a folder.' });
            }

            const uploaded_by_user_id = req.user?.id || 1;

            // 2. Eliminar a pasta da Base de Dados
            await folder.destroy();

            // 3. Tenta gravar o Log de Auditoria de forma segura
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

    // CREATE
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
                is_action_required: is_action_required === 'true' || is_action_required === true,
                status: status || 'Informational',
                parent_document_id: parent_document_id || null
            });

            // LOG: document created (Upload)
            await auditLogService.logEvent({
                user_id: uploaded_by_user_id,
                action: 'DOCUMENT_CREATE',
                entity_type: 'Document',
                entity_id: newDocument.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Document uploaded successfully!', document: newDocument });
        } catch (error) {
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

    // LIST ALL
    async findAll(req, res) {
        try {
            let whereClause = {};
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

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            // Admin change status
            const { title, document_category, status } = req.body;

            const document = await Document.findByPk(id);
            if (!document) return res.status(404).json({ error: 'Document not found.' });

            // IDOR Check
            if (req.user.company_id && document.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await document.update({ title, document_category, status });

            // LOG: document updated
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

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const document = await Document.findByPk(id);
            
            if (!document) return res.status(404).json({ error: 'Document not found.' });

            // IDOR Check
            if (req.user.company_id && document.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await document.destroy();

            // LOG: document deleted
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

    // RESTORE
    async restore(req, res) {
        try {
            const { id } = req.params;
            const document = await Document.findByPk(id, { paranoid: false });
            
            if (!document) return res.status(404).json({ error: 'Document not found.' });
            
            // IDOR Check
            if (req.user.company_id && document.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            if (document.deletedAt === null) return res.status(400).json({ error: 'This document is already active.' });

            await document.restore();

            // LOG: documento restored
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