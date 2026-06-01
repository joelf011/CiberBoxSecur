const dashboardService = require('../services/dashboardService');

const dashboardController = {
    async getDashboardData(req, res) {
        try {
            // Apenas o utilizador logado para o serviço
            const data = await dashboardService.getDashboardData(req.user);
            
            return res.status(200).json(data);
        } catch (error) {
            console.error("Erro no Dashboard Controller:", error);
            return res.status(500).json({ error: 'Erro interno ao carregar dados do dashboard.' });
        }
    }
};

module.exports = dashboardController;