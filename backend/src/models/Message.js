const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Mensagens de chat/ticket enviadas por utilizadores autenticados.
 * Pode ligar-se a um ticket, a uma sala de chat, ou a ambos no fluxo de suporte.
 */
const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        // FK -> Users.id — identifica quem enviou a mensagem.
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    ticket_id: {
        // FK opcional -> Tickets.id — liga a mensagem ao pedido de suporte.
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Tickets', key: 'id' }
    },
    chat_id: {
        // FK opcional -> Chats.id — permite carregar histórico por sala.
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Chats', key: 'id' }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    attachment: {
        // Caminho do ficheiro anexado, quando a mensagem inclui upload.
        type: DataTypes.STRING,
        allowNull: true
    },
    is_read: {
        // Usado para contadores de mensagens não lidas no frontend.
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Messages',
    timestamps: true,
    // Mantém histórico de conversas mesmo após remoção lógica.
    paranoid: true
});

module.exports = Message;
