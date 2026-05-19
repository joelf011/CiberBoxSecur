const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArticleCategory = sequelize.define('ArticleCategory', {
    article_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        allowNull: false 
    },
    category_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        allowNull: false 
    }
}, {
    tableName: 'Article_Categories',
    timestamps: false
});

module.exports = ArticleCategory;