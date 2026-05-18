const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    content_body: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cover_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    published_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Published'),
        defaultValue: 'Draft'
    }
}, {
    tableName: 'Articles',
    timestamps: true,
    paranoid: true
});

module.exports = Article;