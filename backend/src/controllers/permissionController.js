const { Permission } = require('../models');
const auditLogController = require('./auditLogController');

const permissionController = {
    // LIST all
    async getAll(req, res) {
        try {
            const permissions = await Permission.findAll({
                order: [['name', 'ASC']]
            });
            return res.status(200).json(permissions);
        } catch (error) {
            console.error('Get Permissions error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // CREATE
    async create(req, res) {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Permission name is required.' });
            }

            const newPermission = await Permission.create({ name, description });

            // LOG: created
            await auditLogController.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'PERMISSION_CREATE',
                entity_type: 'Permission',
                entity_id: newPermission.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Permission created successfully!', data: newPermission });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This permission already exists.' });
            }
            console.error('Create Permission error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const permission = await Permission.findByPk(id);
            if (!permission) return res.status(404).json({ error: 'Permission not found.' });

            await permission.update({ name, description });

            // LOG: permission updated
            await auditLogController.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'PERMISSION_UPDATE',
                entity_type: 'Permission',
                entity_id: permission.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Permission updated successfully!', data: permission });
        } catch (error) {
            console.error('Update Permission error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const permission = await Permission.findByPk(id);
            
            if (!permission) return res.status(404).json({ error: 'Permission not found.' });

            await permission.destroy();

            // LOG: permission deleted
            await auditLogController.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'PERMISSION_DELETE',
                entity_type: 'Permission',
                entity_id: permission.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Permission deleted successfully!' });
        } catch (error) {
            console.error('Delete Permission error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = permissionController;