const { Incident } = require('../models');
const { Op } = require('sequelize');

/**
 * Responsável por:
 * - Agregar métricas de incidentes para o dashboard do backoffice.
 * - Respeitar o âmbito da empresa quando o utilizador não pode ver tudo.
 *
 * Fluxo:
 * DashboardController -> Service -> Incidents -> KPIs/Gráficos -> Frontend.
 */
const dashboardService = {
    async getDashboardData(user) {
        // Define o âmbito da query com base no cargo/permissões do utilizador autenticado.
        const isAdmin = user.role_id === 1 || (user.permissions && user.permissions.includes('VIEW_ALL_INCIDENTS'));
        
        let whereClause = {};
        if (!isAdmin) {
            whereClause.company_id = user.company_id; 
        }

        // KPIs calculados em paralelo para reduzir latência do dashboard.
        const [openCount, investigatingCount, resolvedCount, criticalCount] = await Promise.all([
            Incident.count({ where: { ...whereClause, status: 'Open' } }),
            Incident.count({ where: { ...whereClause, status: 'Investigating' } }),
            Incident.count({ where: { ...whereClause, status: { [Op.in]: ['Resolved', 'Closed'] } } }),
            Incident.count({ where: { ...whereClause, severity: 'Critical', status: { [Op.notIn]: ['Resolved', 'Closed'] } } })
        ]);

        const kpis = {
            open: openCount,
            investigating: investigatingCount,
            resolved: resolvedCount,
            critical: criticalCount
        };

        // Últimos incidentes para a tabela de ação rápida do dashboard.
        const recentIncidentsRaw = await Incident.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['id', 'title', 'status', 'severity', 'createdAt']
        });

        const recent = recentIncidentsRaw.map(i => ({
            id: i.id,
            title: i.title,
            status: i.status,
            severity: i.severity,
            date: new Date(i.createdAt).toLocaleDateString('pt-PT')
        }));

        // Base comum para gráficos, mantendo apenas os campos necessários.
        const chartDataRaw = await Incident.findAll({
            where: whereClause,
            attributes: ['createdAt', 'cncs_form_data']
        });

        // Tipologia vem do JSONB do formulário CNCS preenchido na criação do incidente.
        const typologyCount = {};
        chartDataRaw.forEach(i => {
            const type = i.cncs_form_data?.incident_type || 'Não Especificado';
            typologyCount[type] = (typologyCount[type] || 0) + 1;
        });
        
        const pieChartData = Object.keys(typologyCount).map(key => ({
            name: key,
            value: typologyCount[key]
        })).sort((a, b) => b.value - a.value).slice(0, 4);

        // Agrega incidentes dos últimos cinco meses para o gráfico de evolução.
        const barChartData = [];
        for (let i = 4; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('pt-PT', { month: 'short' });
            
            const count = chartDataRaw.filter(inc => {
                const incDate = new Date(inc.createdAt);
                return incDate.getMonth() === d.getMonth() && incDate.getFullYear() === d.getFullYear();
            }).length;

            barChartData.push({ name: monthName.charAt(0).toUpperCase() + monthName.slice(1), incidentes: count });
        }

        return {
            kpis,
            recentIncidents: recent,
            barChartData,
            pieChartData
        };
    }
};

module.exports = dashboardService;
