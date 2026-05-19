const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatUser = sequelize.define('ChatUser', {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'Chats', key: 'id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'Chat_Users',
    timestamps: false
});

module.exports = ChatUser;