/**
 * Modelo Company — Empresa cliente da plataforma.
 *
 * Responsável por:
 * - Representar cada empresa cliente que utiliza a plataforma CiberBoxSecur.
 * - Gerir o estado de conformidade NIS2 da empresa.
 * - Estabelecer a ligação entre utilizadores, ativos, documentos, relatórios, incidentes, tickets e chats.
 *
 * Relações:
 * - Pertence a um User como ClientOwner (client_owner_id) — dono/responsável do lado do cliente.
 * - Pertence a um User como EmergencyAdmin (emergency_admin_id) — contacto de emergência.
 * - Tem muitos Users (company_id) — colaboradores da empresa.
 * - Tem muitos Assets, Documents, Reports, Incidents, Tickets, Chats.
 * - Relação M:N com User através de CompanyAdmins — administradores atribuídos à empresa.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    // FK -> Users.id — utilizador cliente que é responsável pela empresa.
    client_owner_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true
    },
    // FK -> Users.id — administrador designado como contacto de emergência.
    emergency_admin_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    // Número de Identificação Fiscal — identificador único da empresa em Portugal.
    nif: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        unique: true 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    address: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    // Estado de conformidade NIS2: Awaiting (por iniciar), Auditing (em auditoria), Compliant (conforme).
    compliance_status: { 
        type: DataTypes.ENUM('Awaiting', 'Auditing', 'Compliant'), 
        defaultValue: 'Awaiting'
    },
    // Controla se a empresa está ativa na plataforma.
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, {
    tableName: 'Companies',
    timestamps: true,
    paranoid: true
});

module.exports = Company;