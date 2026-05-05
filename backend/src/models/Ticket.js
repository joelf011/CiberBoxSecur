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
        allowNull: false
    },
    opened_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Support', 'Billing', 'Emergency'),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Resolved'),
        defaultValue: 'Open'
    }
}, {
    tableName: 'Tickets',
    timestamps: true,
    paranoid: true
});

module.exports = Ticket;