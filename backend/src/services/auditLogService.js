const { AuditLog, User, Role, Company } = require('../models');
const { Op } = require('sequelize');

/**
 * Responsável por:
 * - Centralizar o registo de auditoria usado por controllers e services.
 * - Filtrar logs administrativos com dados de utilizador, cargo e empresa.
 *
 * Fluxo:
 * Ação da aplicação -> auditLogService -> AuditLogs -> Consulta no backoffice.
 */
const auditLogService = {

    // Usado por várias camadas; falhas de auditoria não devem bloquear a operação principal.
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

    // Constrói a query de auditoria consumida pela página de logs do backoffice.
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
            // Filtra pela empresa associada ao utilizador que originou o evento.
            whereClause['$User.company_id$'] = company_id; 
        }

        if (search) {
            // Pesquisa transversal nas colunas próprias e nas associações carregadas via include.
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
