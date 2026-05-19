const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    manager_user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    nif: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        unique: true 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    address: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    compliance_status: { 
        type: DataTypes.ENUM('Awaiting', 'Auditing', 'Compliant'), 
        defaultValue: 'Awaiting'
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
}, {
    tableName: 'Companies',
    timestamps: true,
    paranoid: true
});

module.exports = Company;