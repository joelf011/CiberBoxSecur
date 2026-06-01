const { AuditLog, User, Role, Company } = require('../models');
const { Op } = require('sequelize');

const auditLogService = {

    // This function is called by other controllers/services to log events
    async logEvent({ user_id, action, entity_type, entity_id, ip_address }) {
        try {
            await AuditLog.create({
                user_id: user_id || null,
                action,
                entity_type: entity_type || null,
                entity_id: entity_id || null,
                ip_address: ip_address || null
            });
        } catch (error) {
            console.error('Error saving AuditLog:', error);
        }
    },

    // Fetches the filtered and paginated logs for the Admin
    async getLogs({ page, limit, action, startDate, endDate, search, company_id }) {
        const offset = (page - 1) * limit;
        let whereClause = {};

        if (action && action !== 'Todos os tipos') {
            whereClause.action = action;
        }

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
            };
        } else if (startDate) {
            whereClause.createdAt = { [Op.gte]: `${startDate} 00:00:00` };
        } else if (endDate) {
            whereClause.createdAt = { [Op.lte]: `${endDate} 23:59:59` };
        }

        if (company_id) {
            whereClause['$User.company_id$'] = company_id; 
        }

        if (search) {
            whereClause[Op.or] = [
                { action: { [Op.iLike]: `%${search}%` } },
                { entity_type: { [Op.iLike]: `%${search}%` } },
                { '$User.name$': { [Op.iLike]: `%${search}%` } },
                { '$User.email$': { [Op.iLike]: `%${search}%` } },
                { '$User.Role.name$': { [Op.iLike]: `%${search}%` } },
                { '$User.Company.name$': { [Op.iLike]: `%${search}%` } }
            ];
        }

        const logs = await AuditLog.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'company_id'],
                    include: [
                        { model: Role, attributes: ['name'] },
                        { model: Company, attributes: ['name'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset,
            subQuery: false,
            distinct: true,
            col: 'id'
        });

        return {
            total_records: logs.count,
            total_pages: Math.ceil(logs.count / limit),
            current_page: page,
            data: logs.rows
        };
    }
};

module.exports = auditLogService;