const dashboardService = require('../services/dashboardService');

/**
 * Responsável por:
 * - Entregar ao frontend os KPIs e gráficos do dashboard.
 *
 * Fluxo:
 * DashboardRoute -> authMiddleware -> Controller -> DashboardService -> Incidents.
 */
const dashboardController = {
    async getDashboardData(req, res) {
        try {
            // O service usa req.user para aplicar filtros por cargo, permissões e empresa.
            const data = await dashboardService.getDashboardData(req.user);
            
            return res.status(200).json(data);
        } catch (error) {
            console.error("Erro no Dashboard Controller:", error);
            return res.status(500).json({ error: 'Erro interno ao carregar dados do dashboard.' });
        }
    }
};

module.exports = dashboardController;
