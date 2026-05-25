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
};

module.exports = permissionController;