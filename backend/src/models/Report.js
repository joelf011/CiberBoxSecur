const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    report_type: {
        type: DataTypes.ENUM('PenTest', 'NIS2 Annual', 'Risk Assessment', 'Vulnerability Scan'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    risk_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 10
        }
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Final'),
        defaultValue: 'Draft'
    }
}, {
    tableName: 'Reports',
    timestamps: true,
    paranoid: true
});

module.exports = Report;