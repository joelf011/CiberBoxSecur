const { Article, Category } = require('../models'); // <-- Importamos a Category
const { Op } = require('sequelize');
const fs = require('fs');
const auditLogService = require('./auditLogService');

const includeCategory = [{
    model: Category,
    attributes: ['id', 'name', 'slug'],
    through: { attributes: [] }
}];

const articleService = {
    async create(data, author_id, ipAddress) {
        const newArticle = await Article.create({
            author_id,
            title: data.title,
            slug: data.slug,
            summary: data.summary,
            content_body: data.content_body,
            cover_image: data.cover_image,
            published_date: data.published_date || null,
            status: data.status || 'Draft'
        });

        if (data.category_ids && data.category_ids.length > 0) {
            await newArticle.setCategories(data.category_ids);
        }

        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_CREATE', entity_type: 'Article', entity_id: newArticle.id, ip_address: ipAddress
        });

        return await Article.findByPk(newArticle.id, { include: includeCategory });
    },

    async getPublicArticles(limit = 6, offset = 0, categoryId = null, search = null) {
        // Apenas artigos publicados
        const whereClause = { status: 'Published' };

        // Filtro de Pesquisa (Texto)
        if (search) {
            whereClause.title = { [Op.substring]: search };
        }

        const categoryInclude = {
            model: Category,
            attributes: ['id', 'name', 'slug'],
            through: { attributes: [] }
        };

        // Filtro de Categoria
        if (categoryId) {
            categoryInclude.where = { id: categoryId };
        }

        const isFiltering = search || categoryId;
        let featured = null;

        // Só mostra destaque se não estiver a pesquisar e estiver na página 1
        if (!isFiltering && offset == 0) {
            featured = await Article.findOne({
                where: { status: 'Published' },
                include: [{ model: Category, attributes: ['id', 'name', 'slug'], through: { attributes: [] } }],
                order: [['published_date', 'DESC'], ['createdAt', 'DESC']]
            });
        }

        // Preparar a grelha de resultados
        const gridWhere = { ...whereClause };
        if (featured) {
            gridWhere.id = { [Op.ne]: featured.id }; // Excluir o artigo que já está em destaque
        }

        const articles = await Article.findAndCountAll({
            where: gridWhere,
            include: [categoryInclude],
            order: [['published_date', 'DESC'], ['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        return { featured, newsGrid: articles.rows, total: articles.count };
    },

    async getArticleBySlug(slug) {
        const article = await Article.findOne({ 
            where: { slug, status: 'Published' },
            include: includeCategory
        });
        if (!article) throw new Error('Article not found.');
        return article;
    },

    async findAllAdmin() {
        return await Article.findAll({ 
            include: includeCategory,
            order: [['createdAt', 'DESC']] 
        });
    },

    async update(id, data, author_id, ipAddress) {
        const article = await Article.findByPk(id);
        if (!article) throw new Error('Article not found.');

        let cover_image = article.cover_image;
        
        if (data.cover_image) {
            if (article.cover_image && fs.existsSync(article.cover_image)) {
                fs.unlinkSync(article.cover_image);
            }
            cover_image = data.cover_image;
        }

        await article.update({
            title: data.title,
            slug: data.slug,
            summary: data.summary,
            content_body: data.content_body,
            cover_image,
            published_date: data.published_date,
            status: data.status
        });

        if (data.category_ids !== undefined) {
            await article.setCategories(data.category_ids);
        }

        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_UPDATE', entity_type: 'Article', entity_id: article.id, ip_address: ipAddress
        });

        return await Article.findByPk(article.id, { include: includeCategory });
    },

    async delete(id, author_id, ipAddress) {
        const article = await Article.findByPk(id);
        if (!article) throw new Error('Article not found.');

        await article.setCategories([]);
        await article.destroy();

        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_DELETE', entity_type: 'Article', entity_id: article.id, ip_address: ipAddress
        });

        return true;
    }
};

module.exports = articleService;