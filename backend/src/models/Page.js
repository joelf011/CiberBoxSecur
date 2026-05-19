const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Page = sequelize.define('Page', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    author_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    slug: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true // 'home', 'about-us'
    },
    content_body: { 
        type: DataTypes.JSONB,
        allowNull: true 
    },
    featured_image: {
        type: DataTypes.STRING, 
        allowNull: true 
    },
    status: { 
        type: DataTypes.ENUM('Draft', 'Published'), 
        defaultValue: 'Draft' 
    }
}, {
    tableName: 'Pages',
    timestamps: true,
    paranoid: true
});

module.exports = Page;