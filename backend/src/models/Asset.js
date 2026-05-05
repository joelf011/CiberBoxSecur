const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uploaded_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Assets',
    timestamps: true,
    paranoid: true
});

module.exports = Asset;