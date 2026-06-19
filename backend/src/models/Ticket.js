const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Pedido de suporte aberto por um cliente ou gestor.
 * Liga empresa, utilizador de abertura, gestor atribuído e mensagens associadas.
 */
const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        // FK -> Companies.id — limita o ticket ao tenant da empresa.
        type: DataTypes.INTEGER,
        references: { model: 'Companies', key: 'id' },
        allowNull: false
    },
    opened_by_user_id: {
        // FK -> Users.id — utilizador que abriu o pedido.
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: false
    },
    assigned_to_user_id: {
        // FK opcional -> Users.id — gestor que reclamou o ticket.
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: { model: 'Users', key: 'id' }
    },
    category: {
        type: DataTypes.ENUM('Support', 'Billing', 'Emergency', 'Technical'),
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
    status: {
        // Estado operacional usado para bloquear mensagens em tickets fechados.
        type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
        defaultValue: 'Open'
    }
}, {
    tableName: 'Tickets',
    timestamps: true,
    // Soft delete preserva histórico de suporte e mensagens associadas.
    paranoid: true
});

module.exports = Ticket;
