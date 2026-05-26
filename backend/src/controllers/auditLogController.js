const { AuditLog, User, Role, Company } = require('../models');
const { Op } = require('sequelize');

const auditLogController = {

    // This functions is called inside controllers
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

    // ADMIN -> Read audit log
    async getLogs(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            // Filters - frontend
            const { action, startDate, endDate, search, company_id } = req.query;

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

            // O Segredo está aqui: no Sequelize, se incluímos User, referimo-nos a $User.coluna$.
            // Se dentro de User, incluímos Company, referimo-nos a $User.Company.coluna$ (O C maiúsculo importa!)

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
                            {
                                model: Role,
                                attributes: ['name']
                            },
                            {
                                model: Company,
                                attributes: ['name']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']], // Order
                limit: limit,
                offset: offset,
                // $Nested.Columns$ no whereClause com o limit/offset no findAndCountAll, o subQuery deve estar a false para o PostgreSQL não se confundir nas contagens.
                subQuery: false,
                distinct: true, // Garante que o count é correto mesmo com joins (evita contagem duplicada)
                col: 'AuditLog.id' // Especifica a coluna para o count, garantindo que conta os logs e não os joins
            });

            return res.status(200).json({
                total_records: logs.count,
                total_pages: Math.ceil(logs.count / limit),
                current_page: page,
                data: logs.rows
            });

        } catch (error) {
            console.error('Get Audit Logs error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = auditLogController;