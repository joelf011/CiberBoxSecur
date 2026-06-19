const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Permissões granulares usadas pelo middleware de autorização.
 * São associadas aos cargos através da tabela pivot Role_Permissions.
 */
const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Permissions',
    timestamps: false
});

module.exports = Permission;
