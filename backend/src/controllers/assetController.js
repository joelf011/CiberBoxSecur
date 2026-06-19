/**
 * Controlador de ativos (assets) da empresa.
 *
 * Responsável por:
 * - CRUD completo de ativos com controlo de acesso por empresa.
 * - Classificação CIA (confidencialidade, integridade, disponibilidade).
 * - Soft delete e restauro de ativos.
 * - Registo de auditoria em cada operação.
 *
 * Fluxo:
 * Frontend -> Rota Express (com auth middleware) -> Controller -> Modelo Asset (Sequelize) -> Base de Dados -> Resposta JSON.
 */
const { Asset } = require('../models');
const auditLogService = require('../services/auditLogService');

const assetController = {
    // Cria um novo ativo associado à empresa e ao utilizador autenticado.
    async create(req, res) {
        try {
            // Identifica o utilizador que está a criar o ativo (vem do middleware de autenticação).
            const created_by_user_id = req.user.id; 

            const { 
                company_id, asset_code, name, description, category, 
                owner, location, confidentiality, integrity, availability, status 
            } = req.body;

            // Valores por defeito para a classificação CIA e estado, caso não sejam fornecidos.
            const newAsset = await Asset.create({
                company_id,
                created_by_user_id,
                asset_code,
                name,
                description,
                category,
                owner,
                location,
                confidentiality: confidentiality || 'Medium',
                integrity: integrity || 'Medium',
                availability: availability || 'Medium',
                status: status || 'Active'
            });

            // Regista a criação do ativo no log de auditoria.
            await auditLogService.logEvent({
                user_id: created_by_user_id,
                action: 'ASSET_CREATE',
                entity_type: 'Asset',
                entity_id: newAsset.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Asset created successfully!', asset: newAsset });
        } catch (error) {
            // company_id inválido — a empresa referenciada não existe na BD.
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company does not exist.' });
            }
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }

            // Valor de enum inválido para categoria, estado ou níveis de risco.
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for category, status or risk levels.' });
            }
            
            console.error('Create Asset error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista todos os ativos, filtrados pela empresa do utilizador (admin vê todos).
    async findAll(req, res) {
        try {
            // Se o utilizador pertence a uma empresa, filtra por essa empresa (proteção IDOR).
            let whereClause = {};
            if (req.user.company_id) {
                whereClause.company_id = req.user.company_id;
            }

            const assets = await Asset.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(assets);
        } catch (error) {
            console.error('Find All Assets error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Devolve um único ativo por ID, com validação de pertença à empresa do utilizador.
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset.findByPk(id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            // Impede acesso a ativos de outra empresa (proteção IDOR).
            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden: Access denied to this asset.' });
            }

            return res.status(200).json(asset);
        } catch (error) {
            console.error('Find One Asset error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Atualiza um ativo existente, com verificação de acesso por empresa.
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const asset = await Asset.findByPk(id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            // Proteção IDOR — apenas utilizadores da mesma empresa podem editar.
            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await asset.update(updates);

            // Regista a atualização no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'ASSET_UPDATE',
                entity_type: 'Asset',
                entity_id: asset.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Asset updated successfully!', asset });
        } catch (error) {
            console.error('Update Asset error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Apaga logicamente um ativo (soft delete via Sequelize paranoid).
    async delete(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset.findByPk(id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            // Proteção IDOR — impede eliminação de ativos de outra empresa.
            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            // Soft delete — marca o registo com deletedAt em vez de o remover fisicamente.
            await asset.destroy();

            // Regista a eliminação no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'ASSET_DELETE',
                entity_type: 'Asset',
                entity_id: asset.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Asset deleted successfully!' });
        } catch (error) {
            console.error('Delete Asset error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Restaura um ativo previamente eliminado (reverte soft delete).
    async restore(req, res) {
        try {
            const { id } = req.params;
            // paranoid: false permite encontrar registos com soft delete ativo.
            const asset = await Asset.findByPk(id, { paranoid: false });
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            // Proteção IDOR — restringe restauro a ativos da mesma empresa.
            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            // Verifica se o ativo já está ativo para evitar restauro desnecessário.
            if (asset.deletedAt === null) {
                return res.status(400).json({ error: 'This asset is already active.' });
            }

            // Limpa o campo deletedAt, reativando o registo.
            await asset.restore();

            // Regista o restauro no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'ASSET_RESTORE',
                entity_type: 'Asset',
                entity_id: asset.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Asset restored successfully!', asset });
        } catch (error) {
            console.error('Restore Asset error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = assetController;