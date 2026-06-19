/**
 * Modelo Category — Categoria de artigos do CMS.
 *
 * Responsável por:
 * - Organizar os artigos do blog por temas (ex: "NIS2", "Cibersegurança").
 *
 * Relações:
 * - Relação M:N com Article através da tabela pivot ArticleCategory.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    // Identificador amigável para URL (ex: "ciberseguranca").
    slug: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    }
}, {
    tableName: 'Categories',
    timestamps: true,
    paranoid: true
});

module.exports = Category;