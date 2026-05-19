const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incident = sequelize.define('Incident', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Companies',
            key: 'id'
        }
    },
    asset_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Assets',
            key: 'id'
        }
    },
    reported_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('Residual', 'Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('Open', 'Investigating', 'Mitigated', 'Resolved', 'Reported_to_CNCS', 'Closed'),
        defaultValue: 'Open'
    },
    cncs_form_data: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'Incidents',
    timestamps: true,
    paranoid: true
});

module.exports = Incident;