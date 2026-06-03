const { Asset } = require('../models');
const auditLogService = require('../services/auditLogService');

const assetController = {
    // CREATE
    async create(req, res) {
        try {
            const created_by_user_id = req.user.id; 

            const { 
                company_id, asset_code, name, description, category, 
                owner, location, confidentiality, integrity, availability, status 
            } = req.body;

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

            // LOG
            await auditLogService.logEvent({
                user_id: created_by_user_id,
                action: 'ASSET_CREATE',
                entity_type: 'Asset',
                entity_id: newAsset.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Asset created successfully!', asset: newAsset });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company does not exist.' });
            }
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }

            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for category, status or risk levels.' });
            }
            
            console.error('Create Asset error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ALL
    async findAll(req, res) {
        try {
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

    // READ ONE
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset.findByPk(id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden: Access denied to this asset.' });
            }

            return res.status(200).json(asset);
        } catch (error) {
            console.error('Find One Asset error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const asset = await Asset.findByPk(id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await asset.update(updates);

            // LOG: updated
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

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset.findByPk(id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await asset.destroy();

            // LOG: deleted
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

    // RESTORE
    async restore(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset.findByPk(id, { paranoid: false });
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found.' });
            }

            if (req.user.company_id && asset.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            if (asset.deletedAt === null) {
                return res.status(400).json({ error: 'This asset is already active.' });
            }

            await asset.restore();

            // LOG: restored
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