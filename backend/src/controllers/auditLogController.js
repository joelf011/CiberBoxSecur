/**
 * Controlador de logs de auditoria.
 *
 * Responsável por:
 * - Consulta paginada e filtrada dos registos de auditoria (apenas admin).
 *
 * Fluxo:
 * Frontend (painel admin) -> Rota Express (com auth + permissões) -> Controller -> auditLogService -> Base de Dados -> Resposta JSON paginada.
 */
const auditLogService = require('../services/auditLogService');

const auditLogController = {

    // Devolve os logs de auditoria com paginação e filtros opcionais (ação, datas, pesquisa, empresa).
    async getLogs(req, res) {
        try {
            // Extrai parâmetros de paginação com valores por defeito (página 1, 20 por página).
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const { action, startDate, endDate, search, company_id } = req.query;

            // Delega ao serviço a construção da query e a filtragem na base de dados.
            const result = await auditLogService.getLogs({
                page,
                limit,
                action,
                startDate,
                endDate,
                search,
                company_id
            });

            return res.status(200).json(result);

        } catch (error) {
            console.error('Get Audit Logs error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = auditLogController;