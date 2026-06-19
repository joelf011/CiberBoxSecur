const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Cargo funcional atribuído a utilizadores.
 * As permissões efetivas vêm da relação M:N com Permission.
 */
const Role = sequelize.define('Role', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    }
}, {
    tableName: 'Roles',
    timestamps: true,
    paranoid: true // Usa deleted_at para permitir restauro de cargos.
});

module.exports = Role;
