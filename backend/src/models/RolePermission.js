const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Roles', key: 'id' }
    },
    permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Permissions', key: 'id' }
    }
}, {
    tableName: 'Role_Permissions',
    timestamps: false
});

module.exports = RolePermission;