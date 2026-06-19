const incidentService = require('../services/incidentService');

/**
 * Responsável por:
 * - Expor endpoints de incidentes ao frontend autenticado.
 * - Traduzir erros do service para respostas HTTP consistentes.
 *
 * Fluxo:
 * Frontend -> rota protegida -> Controller -> IncidentService -> Base de dados -> JSON.
 */
const incidentController = {
    // Cria um incidente usando a empresa e permissões já validadas pelos middlewares.
    async create(req, res) {
        try {
            const newIncident = await incidentService.create(req.user, req.body, req.ip);
            return res.status(201).json({ message: 'Incident reported successfully!', incident: newIncident });
        } catch (error) {
            if (error.name === 'CustomValidationError') return res.status(400).json({ error: error.message });
            if (error.name === 'SequelizeForeignKeyConstraintError') return res.status(400).json({ error: 'The specified company or asset does not exist.' });
            if (error.name === 'SequelizeValidationError') return res.status(400).json({ error: error.errors[0].message }); 
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) return res.status(400).json({ error: 'Invalid value provided for severity or status.' });
            
            console.error('Create Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista incidentes dentro do âmbito permitido para o utilizador autenticado.
    async findAll(req, res) {
        try {
            const incidents = await incidentService.findAll(req.user.company_id);
            return res.status(200).json(incidents);
        } catch (error) {
            console.error('Find All Incidents error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Devolve o detalhe do incidente após validação de pertença à empresa.
    async findOne(req, res) {
        try {
            const incident = await incidentService.findOne(req.params.id, req.user.company_id);
            return res.status(200).json(incident);
        } catch (error) {
            if (error.message === 'Incident not found.') return res.status(404).json({ error: error.message });
            if (error.name === 'ForbiddenError') return res.status(403).json({ error: error.message });
            
            console.error('Find One Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Atualiza campos do incidente e delega auditoria no service.
    async update(req, res) {
        try {
            const incident = await incidentService.update(req.params.id, req.body, req.user, req.ip);
            return res.status(200).json({ message: 'Incident updated successfully!', incident });
        } catch (error) {
            if (error.message === 'Incident not found.') return res.status(404).json({ error: error.message });
            if (error.name === 'ForbiddenError') return res.status(403).json({ error: error.message });
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) return res.status(400).json({ error: 'Invalid value provided for severity or status.' });

            console.error('Update Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Apaga logicamente o incidente mantendo histórico na base de dados.
    async delete(req, res) {
        try {
            await incidentService.delete(req.params.id, req.user, req.ip);
            return res.status(200).json({ message: 'Incident deleted successfully!' });
        } catch (error) {
            if (error.message === 'Incident not found.') return res.status(404).json({ error: error.message });
            if (error.name === 'ForbiddenError') return res.status(403).json({ error: error.message });

            console.error('Delete Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Restaura incidentes com soft delete, respeitando a fronteira entre empresas.
    async restore(req, res) {
        try {
            const incident = await incidentService.restore(req.params.id, req.user, req.ip);
            return res.status(200).json({ message: 'Incident restored successfully!', incident });
        } catch (error) {
            if (error.message === 'Incident not found.') return res.status(404).json({ error: error.message });
            if (error.name === 'ForbiddenError') return res.status(403).json({ error: error.message });
            if (error.name === 'CustomValidationError') return res.status(400).json({ error: error.message });

            console.error('Restore Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = incidentController;
