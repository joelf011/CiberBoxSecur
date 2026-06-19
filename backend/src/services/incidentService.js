const { Incident, Company, User } = require('../models');
const auditLogService = require('./auditLogService');

/**
 * Responsável por:
 * - Criar e gerir incidentes reportados por clientes ou gestores.
 * - Aplicar restrições por empresa antes de consultar ou alterar dados.
 *
 * Fluxo:
 * IncidentController -> Service -> Incidents -> AuditLogs -> Resposta ao frontend.
 */
const includeOptions = [
    { model: Company, as: 'Company', attributes: ['id', 'name'] },
    { model: User, as: 'User', attributes: ['id', 'name', 'email'] }
];

const incidentService = {
    async create(user, data, ipAddress) {
        // Clientes ficam sempre presos à sua empresa; admins podem indicar outra empresa.
        const target_company_id = user.company_id ? user.company_id : data.company_id;
        
        if (!target_company_id) {
            const error = new Error('Company ID is required.');
            error.name = 'CustomValidationError';
            throw error;
        }

        const newIncident = await Incident.create({
            company_id: target_company_id,
            asset_id: data.asset_id,
            reported_by_user_id: user.id,
            title: data.title,
            severity: data.severity || 'Medium',
            status: data.status || 'Open',
            cncs_form_data: data.cncs_form_data
        });

        // Auditoria liga o incidente ao utilizador que fez o reporte.
        await auditLogService.logEvent({
            user_id: user.id,
            action: 'INCIDENT_CREATE',
            entity_type: 'Incident',
            entity_id: newIncident.id,
            ip_address: ipAddress
        });

        return newIncident;
    },

    async findAll(userCompanyId) {
        let whereClause = {};
        
        // A presença de company_id limita a listagem ao tenant do cliente.
        if (userCompanyId) {
            whereClause.company_id = userCompanyId;
        }

        return await Incident.findAll({
            where: whereClause,
            include: includeOptions,
            order: [['createdAt', 'DESC']]
        });
    },

    async findOne(id, userCompanyId) {
        const incident = await Incident.findByPk(id, { include: includeOptions });
        if (!incident) throw new Error('Incident not found.');

        // Proteção IDOR: impede leitura de incidentes de outra empresa.
        if (userCompanyId && incident.company_id !== userCompanyId) {
            const error = new Error('Forbidden: Access denied.');
            error.name = 'ForbiddenError';
            throw error;
        }
        return incident;
    },

    async update(id, updates, user, ipAddress) {
        // Reutiliza a validação de leitura para garantir acesso antes de editar.
        const incident = await this.findOne(id, user.company_id); 

        await incident.update(updates);

        // Regista alterações de estado/detalhe para auditoria operacional.
        await auditLogService.logEvent({
            user_id: user.id,
            action: 'INCIDENT_UPDATE',
            entity_type: 'Incident',
            entity_id: incident.id,
            ip_address: ipAddress
        });

        return incident;
    },

    async delete(id, user, ipAddress) {
        // Reutiliza a validação de acesso antes do soft delete.
        const incident = await this.findOne(id, user.company_id);

        await incident.destroy();

        // O soft delete é auditado para manter o histórico do ciclo de vida.
        await auditLogService.logEvent({
            user_id: user.id,
            action: 'INCIDENT_DELETE',
            entity_type: 'Incident',
            entity_id: incident.id,
            ip_address: ipAddress
        });

        return true;
    },

    async restore(id, user, ipAddress) {
        // paranoid:false permite recuperar registos já eliminados logicamente.
        const incident = await Incident.findByPk(id, { paranoid: false, include: includeOptions });
        
        if (!incident) throw new Error('Incident not found.');
        
        // Mantém a fronteira entre empresas também no fluxo de restauro.
        if (user.company_id && incident.company_id !== user.company_id) {
            const error = new Error('Forbidden: Access denied.');
            error.name = 'ForbiddenError';
            throw error;
        }

        if (incident.deletedAt === null) {
            const error = new Error('This incident is already active.');
            error.name = 'CustomValidationError';
            throw error;
        }

        await incident.restore();

        // Regista o restauro para fechar a trilha de auditoria.
        await auditLogService.logEvent({
            user_id: user.id,
            action: 'INCIDENT_RESTORE',
            entity_type: 'Incident',
            entity_id: incident.id,
            ip_address: ipAddress
        });

        return incident;
    }
};

module.exports = incidentService;
