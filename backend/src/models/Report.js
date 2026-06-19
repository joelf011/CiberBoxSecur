const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Relatórios NIS2 e técnicos associados a empresas.
 * Guarda metadados na BD e o caminho do ficheiro servido pela API.
 */
const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        // FK -> Companies.id — empresa proprietária do relatório.
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_by_user_id: {
        // FK -> Users.id — utilizador que carregou o relatório.
        type: DataTypes.INTEGER,
        allowNull: false
    },
    report_type: {
        type: DataTypes.ENUM('PenTest', 'NIS2 Annual', 'Risk Assessment', 'Vulnerability Scan'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    risk_score: {
        // Escala normalizada usada em relatórios de risco.
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 10
        }
    },
    file_path: {
        // Caminho relativo do ficheiro físico guardado em uploads.
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Final'),
        defaultValue: 'Draft'
    }
}, {
    tableName: 'Reports',
    timestamps: true,
    // Soft delete preserva relatórios para histórico e auditoria.
    paranoid: true
});

module.exports = Report;
