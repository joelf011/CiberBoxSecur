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
        allowNull: false
    },
    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Messages',
    timestamps: true,
    paranoid: true
});

module.exports = Message;