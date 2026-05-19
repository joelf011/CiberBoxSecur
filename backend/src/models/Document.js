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
        allowNull: false,
        references: { model: 'Companies', key: 'id' }
    },
    uploaded_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    document_category: { 
        type: DataTypes.ENUM('Policies', 'Network', 'Training', 'Incident_Response', 'Templates', 'Other'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_action_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('Informational', 'Pending_Client', 'Submitted', 'Approved', 'Rejected'),
        defaultValue: 'Informational'
    },
    parent_document_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Documents', key: 'id' }
    }
}, {
    tableName: 'Documents',
    timestamps: true,
    paranoid: true
});

module.exports = Document;