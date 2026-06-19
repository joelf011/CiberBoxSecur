/**
 * Modelo Chat — Conversa entre utilizadores no contexto de uma empresa.
 *
 * Responsável por:
 * - Representar uma sessão de chat associada a uma empresa.
 * - Agrupar mensagens e participantes de uma conversa.
 *
 * Relações:
 * - Pertence a uma Company (company_id) — empresa onde a conversa ocorre.
 * - Relação M:N com User através da tabela pivot ChatUser.
 * - Tem muitas Messages (chat_id) — mensagens enviadas nesta conversa.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // FK -> Companies.id — empresa à qual esta conversa pertence.
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Companies', key: 'id' }
    }
}, {
    tableName: 'Chats',
    timestamps: true,
    paranoid: true
});

module.exports = Chat;