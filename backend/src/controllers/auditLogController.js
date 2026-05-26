const { AuditLog, User, Role } = require('../models');
const { Op } = require('sequelize');

const auditLogController = {

    // ADMIN -> Read audit log
    async getLogs(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            
            // Filters - frontend
            const { action, date, search } = req.query;

            let whereClause = {};

            if (action) whereClause.action = action;

            if (date) {
                whereClause.createdAt = {
                    [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`]
                };
            }
            if (search) {
                whereClause[Op.or] = [
                    { action: { [Op.iLike]: `%${search}%` } },
                    { entity_type: { [Op.iLike]: `%${search}%` } },
                    // Search user
                    { '$User.name$': { [Op.iLike]: `%${search}%` } },
                    { '$User.email$': { [Op.iLike]: `%${search}%` } },
                    { '$User.Role.name$': { [Op.iLike]: `%${search}%` } }
                ];
            }

            const logs = await AuditLog.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'email'],
                        include: [
                            {
                                model: Role,
                                attributes: ['name']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']], // Order
                limit: limit,
                offset: offset
            });

            return res.status(200).json({
                total_records: logs.count,
                current_page_records: logs.rows.length,
                data: logs.rows
            });

        } catch (error) {
            console.error('Get Audit Logs error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = auditLogController;