const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Tabela pivot entre cargos e permissões.
 * Define a matriz RBAC usada pelo permissionMiddleware.
 */
const RolePermission = sequelize.define('RolePermission', {
    role_id: {
        // FK -> Roles.id
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Roles', key: 'id' }
    },
    permission_id: {
        // FK -> Permissions.id
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Permissions', key: 'id' }
    }
}, {
    tableName: 'Role_Permissions',
    // Pivot técnica sem histórico temporal próprio.
    timestamps: false
});

module.exports = RolePermission;
