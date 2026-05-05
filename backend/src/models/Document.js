const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
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
    document_category: { 
        type: DataTypes.ENUM('Policies', 'Network', 'Training', 'Incident_Response', 'Other'),
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
    tableName: 'Documents',
    timestamps: true,
    paranoid: true
});

module.exports = Document;