const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entity_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    entity_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'AuditLogs',
    timestamps: true,
    updatedAt: false,
    paranoid: false
});

module.exports = AuditLog;