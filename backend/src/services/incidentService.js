const { Incident } = require('../models');
const auditLogService = require('./auditLogService');

const incidentService = {
    async create(user, data, ipAddress) {
        // Force the users company ID
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

        // LOG
        await await auditLogService.logEvent({
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
        
        // If the user is a Client restrict the query
        if (userCompanyId) {
            whereClause.company_id = userCompanyId;
        }

        return await Incident.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
    },

    async findOne(id, userCompanyId) {
        const incident = await Incident.findByPk(id);
        if (!incident) throw new Error('Incident not found.');

        // Prevent a client from viewing an incident that belongs to another company
        if (userCompanyId && incident.company_id !== userCompanyId) {
            const error = new Error('Forbidden: Access denied.');
            error.name = 'ForbiddenError';
            throw error;
        }
        return incident;
    },

    async update(id, updates, user, ipAddress) {
        // Reuses the validation logic from findOne to ensure the user has access
        const incident = await this.findOne(id, user.company_id); 

        await incident.update(updates);

        // LOG
        await await auditLogService.logEvent({
            user_id: user.id,
            action: 'INCIDENT_UPDATE',
            entity_type: 'Incident',
            entity_id: incident.id,
            ip_address: ipAddress
        });

        return incident;
    },

    async delete(id, user, ipAddress) {
        // Reuses the validation logic from findOne
        const incident = await this.findOne(id, user.company_id);

        await incident.destroy();

        // LOG
        await await auditLogService.logEvent({
            user_id: user.id,
            action: 'INCIDENT_DELETE',
            entity_type: 'Incident',
            entity_id: incident.id,
            ip_address: ipAddress
        });

        return true;
    },

    async restore(id, user, ipAddress) {
        // To find a soft-deleted record
        const incident = await Incident.findByPk(id, { paranoid: false });
        
        if (!incident) throw new Error('Incident not found.');
        
        // Security check
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

        // Log the restore event
        await await auditLogService.logEvent({
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