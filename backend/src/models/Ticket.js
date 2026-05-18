const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Companies', key: 'id' },
        allowNull: false
    },
    opened_by_user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: false
    },
    assigned_to_user_id: {
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
        type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
        defaultValue: 'Open'
    }
}, {
    tableName: 'Tickets',
    timestamps: true,
    paranoid: true
});

module.exports = Ticket;