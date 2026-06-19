/**
 * Modelo AuditLog — Registo de auditoria do sistema.
 *
 * Responsável por:
 * - Registar todas as ações relevantes dos utilizadores para fins de auditoria.
 * - Manter um histórico imutável de operações (sem updatedAt nem soft delete).
 * - Guardar referências genéricas a qualquer entidade (entity_type + entity_id).
 *
 * Relações:
 * - Pertence a um User (user_id) — utilizador que executou a ação (nullable para ações do sistema).
 *
 * Nota: Registos de auditoria nunca são editados ou eliminados (sem paranoid, sem updatedAt).
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // FK -> Users.id — nullable para permitir ações automáticas do sistema.
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // Descrição da ação realizada (ex: "LOGIN", "CREATE_TICKET").
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Tipo da entidade afetada (ex: "Ticket", "User", "Document").
    entity_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // ID da entidade afetada — referência polimórfica.
    entity_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // Endereço IP de origem do pedido.
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'AuditLogs',
    timestamps: true,
    // Sem updatedAt — registos de auditoria são imutáveis.
    updatedAt: false,
    // Sem soft delete — registos de auditoria nunca são eliminados.
    paranoid: false
});

module.exports = AuditLog;