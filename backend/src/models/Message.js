const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Tickets', key: 'id' }
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Chats', key: 'id' }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Messages',
    timestamps: true,
    paranoid: true
});

module.exports = Message;