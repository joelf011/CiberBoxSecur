const { Incident, sequelize } = require('../models');
const { Op } = require('sequelize');

const dashboardController = {
    async getDashboardData(req, res) {
        try {
            // RBAC logic
            const isAdmin = req.user.role_id === 1 || (req.user.permissions && req.user.permissions.includes('VIEW_ALL_INCIDENTS'));
            
            let whereClause = {};
            if (!isAdmin) {
                whereClause.company_id = req.user.company_id; 
            }

            // LOAD ALL
            const allIncidents = await Incident.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            });

            // kpis
            const kpis = {
                open: allIncidents.filter(i => i.status === 'Open').length,
                investigating: allIncidents.filter(i => i.status === 'Investigating').length,
                resolved: allIncidents.filter(i => ['Resolved', 'Closed'].includes(i.status)).length,
                critical: allIncidents.filter(i => i.severity === 'Critical' && !['Resolved', 'Closed'].includes(i.status)).length
            };

            // Last 5 incidents
            const recent = allIncidents.slice(0, 5).map(i => ({
                id: i.id,
                title: i.title,
                status: i.status,
                severity: i.severity,
                date: new Date(i.createdAt).toLocaleDateString('pt-PT')
            }));

            // Circular graph data
            const typologyCount = {};
            allIncidents.forEach(i => {
                const type = i.cncs_form_data?.incident_type || 'Não Especificado';
                typologyCount[type] = (typologyCount[type] || 0) + 1;
            });
            
            const pieChartData = Object.keys(typologyCount).map(key => ({
                name: key,
                value: typologyCount[key]
            })).sort((a, b) => b.value - a.value).slice(0, 4); // Top 4

            // Bar chart data
            const barChartData = [];
            for (let i = 4; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthName = d.toLocaleString('pt-PT', { month: 'short' });
                
                // Contar incidentes deste mês e ano
                const count = allIncidents.filter(inc => {
                    const incDate = new Date(inc.createdAt);
                    return incDate.getMonth() === d.getMonth() && incDate.getFullYear() === d.getFullYear();
                }).length;

                barChartData.push({ name: monthName.charAt(0).toUpperCase() + monthName.slice(1), incidentes: count });
            }

            return res.status(200).json({
                kpis,
                recentIncidents: recent,
                barChartData,
                pieChartData
            });

        } catch (error) {
            console.error("Erro no Dashboard Controller:", error);
            return res.status(500).json({ error: 'Erro interno ao carregar dados do dashboard.' });
        }
    }
};

module.exports = dashboardController;