const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Conteúdos editáveis do website guardados em JSONB.
 * O backoffice grava estes blocos e a homepage pública consome-os por slug.
 */
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
        unique: true // Identifica páginas editáveis como "home" ou "about-us".
    },
    content_body: { 
        // Estrutura flexível para secções do CMS sem criar colunas por bloco.
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
    // Permite recuperar versões eliminadas no backoffice se necessário.
    paranoid: true
});

module.exports = Page;
