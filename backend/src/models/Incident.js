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
        allowNull: false
    },
    reported_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Investigating', 'Mitigated', 'Reported'),
        defaultValue: 'Investigating'
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