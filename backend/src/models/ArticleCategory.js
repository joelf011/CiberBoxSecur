/**
 * Modelo ArticleCategory — Tabela pivot Article <-> Category.
 *
 * Responsável por:
 * - Estabelecer a relação muitos-para-muitos entre artigos e categorias.
 * - Permitir que um artigo pertença a várias categorias e vice-versa.
 *
 * Relações:
 * - article_id -> Articles.id
 * - category_id -> Categories.id
 * - Chave primária composta (article_id + category_id).
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArticleCategory = sequelize.define('ArticleCategory', {
    // FK -> Articles.id
    article_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        allowNull: false 
    },
    // FK -> Categories.id
    category_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        allowNull: false 
    }
}, {
    tableName: 'Article_Categories',
    // Tabela pivot sem necessidade de timestamps.
    timestamps: false
});

module.exports = ArticleCategory;