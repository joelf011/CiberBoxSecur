const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Utilizador autenticável da plataforma.
 * Liga cargos, empresas, tokens temporários e dados de perfil usados no backoffice.
 */
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        // FK -> Roles.id — base do RBAC.
        type: DataTypes.INTEGER,
        allowNull: true
    },
    company_id: {
        // FK opcional -> Companies.id — limita clientes ao seu tenant.
        type: DataTypes.INTEGER,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    password: {
        // Hash bcrypt; null enquanto a conta ainda não foi ativada.
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
    type: DataTypes.TEXT,
    allowNull: true
    },
    activation_token: {
        // Token temporário usado em ativação de conta e recuperação de password.
        type: DataTypes.STRING,
        allowNull: true
    },
    token_expires_at: {
        // Expiração do token temporário para reduzir janela de risco.
        type: DataTypes.DATE,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_2fa_enabled: {
        // Reservado para expansão futura de autenticação multifator.
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        // Permite bloquear login sem remover a conta.
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'Users',
    timestamps: true,
    // Soft delete mantém histórico de auditoria ligado ao utilizador.
    paranoid: true
});

module.exports = User;
