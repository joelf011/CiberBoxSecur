const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Chats',
    timestamps: true,
    paranoid: true
});

module.exports = Chat;