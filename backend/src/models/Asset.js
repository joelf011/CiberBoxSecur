/**
 * Modelo Asset — Ativo organizacional para conformidade NIS2.
 *
 * Responsável por:
 * - Registar os ativos (hardware, software, rede, etc.) de cada empresa.
 * - Classificar cada ativo segundo a tríade CIA (Confidencialidade, Integridade, Disponibilidade).
 * - Apoiar a avaliação de risco e gestão de incidentes.
 *
 * Relações:
 * - Pertence a uma Company (company_id) — empresa proprietária do ativo.
 * - Pertence a um User (created_by_user_id) — utilizador que registou o ativo.
 * - Pode ser referenciado por Incident (asset_id) — incidentes associados.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // FK -> Companies.id — empresa à qual o ativo pertence.
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // FK -> Users.id — utilizador que criou o registo do ativo.
    created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    
    // Código interno de inventário (ex: "HW-001").
    asset_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Tipo de ativo segundo a classificação ISO 27001.
    category: {
        type: DataTypes.ENUM('Hardware', 'Software', 'Network', 'Information', 'Service', 'People', 'Facilities'),
        allowNull: false
    },
    // Responsável pelo ativo (pode não ser o criador).
    owner: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Localização física ou lógica do ativo.
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // --- Classificação CIA (tríade de segurança) ---
    // Nível de confidencialidade — impacto da divulgação não autorizada.
    confidentiality: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium'
    },
    // Nível de integridade — impacto de alterações não autorizadas.
    integrity: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium'
    },
    // Nível de disponibilidade — impacto da indisponibilidade.
    availability: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium'
    },
    // Estado do ciclo de vida do ativo.
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Maintenance', 'Retired'),
        defaultValue: 'Active'
    }
}, {
    tableName: 'Assets',
    timestamps: true,
    // Soft delete — preserva o histórico do ativo para auditorias.
    paranoid: true
});

module.exports = Asset;