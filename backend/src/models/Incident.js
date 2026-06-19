/**
 * Modelo Incident — Incidente de segurança.
 *
 * Responsável por:
 * - Registar incidentes de cibersegurança reportados por utilizadores.
 * - Classificar a severidade e acompanhar o estado de resolução.
 * - Armazenar dados do formulário CNCS (Centro Nacional de Cibersegurança) para reporte obrigatório.
 *
 * Relações:
 * - Pertence a uma Company (company_id) — empresa afetada.
 * - Pertence a um User (reported_by_user_id) — utilizador que reportou.
 * - Pode estar associado a um Asset (asset_id) — ativo afetado pelo incidente.
 *
 * Fluxo:
 * Reporte (Open) -> Investigação -> Mitigação -> Resolução -> Reporte CNCS -> Encerramento.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incident = sequelize.define('Incident', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // FK -> Companies.id — empresa afetada pelo incidente.
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Companies',
            key: 'id'
        }
    },
    // FK -> Assets.id — ativo afetado (opcional, pode não estar identificado).
    asset_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Assets',
            key: 'id'
        }
    },
    // FK -> Users.id — utilizador que reportou o incidente.
    reported_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Nível de gravidade — determina prioridade de resposta.
    severity: {
        type: DataTypes.ENUM('Residual', 'Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    // Estado do ciclo de vida do incidente, inclui reporte ao CNCS.
    status: {
        type: DataTypes.ENUM('Open', 'Investigating', 'Mitigated', 'Resolved', 'Reported_to_CNCS', 'Closed'),
        defaultValue: 'Open'
    },
    // Dados estruturados do formulário CNCS — obrigatório para conformidade NIS2.
    cncs_form_data: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'Incidents',
    timestamps: true,
    paranoid: true
});

module.exports = Incident;