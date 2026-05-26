const { AuditLog } = require('../models');

const auditLogService = {
    // This functions is called inside controllers/services
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
    }
};

module.exports = auditLogService;