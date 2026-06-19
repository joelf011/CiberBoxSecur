/**
 * Modelo ChatUser — Tabela pivot Chat <-> User.
 *
 * Responsável por:
 * - Estabelecer a relação muitos-para-muitos entre chats e utilizadores.
 * - Definir quais utilizadores participam em cada conversa.
 *
 * Relações:
 * - chat_id -> Chats.id
 * - user_id -> Users.id
 * - Chave primária composta (chat_id + user_id).
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatUser = sequelize.define('ChatUser', {
    // FK -> Chats.id
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Chats', key: 'id' }
    },
    // FK -> Users.id
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'Chat_Users',
    // Tabela pivot sem necessidade de timestamps.
    timestamps: false
});

module.exports = ChatUser;