/**
 * Modelo Article — Artigo do blog/CMS.
 *
 * Responsável por:
 * - Armazenar artigos publicados na plataforma (blog de cibersegurança).
 * - Suportar rascunhos e publicação com data configurável.
 *
 * Relações:
 * - Pertence a um User (author_id) — o autor do artigo.
 * - Relação M:N com Category através da tabela pivot ArticleCategory.
 *
 * Fluxo:
 * Utilizador cria artigo (Draft) -> Publica (Published) -> Visível no frontend público.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // FK -> Users.id — autor responsável pelo artigo.
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Identificador amigável para URL (ex: "boas-praticas-nis2").
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Resumo curto apresentado em listagens e pré-visualizações.
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Corpo completo do artigo em texto/HTML.
    content_body: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Caminho ou URL da imagem de capa.
    cover_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Data de publicação — pode ser futura para agendamento.
    published_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    // Draft: rascunho ainda não visível; Published: visível publicamente.
    status: {
        type: DataTypes.ENUM('Draft', 'Published'),
        defaultValue: 'Draft'
    }
}, {
    tableName: 'Articles',
    timestamps: true,
    // Soft delete — mantém registo para auditoria e recuperação.
    paranoid: true
});

module.exports = Article;