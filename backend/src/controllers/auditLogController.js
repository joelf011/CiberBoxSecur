const auditLogService = require('../services/auditLogService');

const auditLogController = {

    // ADMIN -> Read audit log
    async getLogs(req, res) {
        try {
            // Extract query data and define defaults
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const { action, startDate, endDate, search, company_id } = req.query;

            // Call service
            const result = await auditLogService.getLogs({
                page,
                limit,
                action,
                startDate,
                endDate,
                search,
                company_id
            });

            // Success
            return res.status(200).json(result);

        } catch (error) {
            console.error('Get Audit Logs error:', error);
            // Error -> 500
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = auditLogController;