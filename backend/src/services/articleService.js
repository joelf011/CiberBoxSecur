const { Article } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const auditLogService = require('./auditLogService');

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

        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_CREATE', entity_type: 'Article', entity_id: newArticle.id, ip_address: ipAddress
        });

        return newArticle;
    },

    async getPublicArticles(limit = 6, offset = 0) {
        // Featured
        const featured = await Article.findOne({
            where: { status: 'Published' },
            order: [['published_date', 'DESC'], ['createdAt', 'DESC']]
        });

        let newsGrid = [];
        let total = 0;

        if (featured) {
            // Grid
            const articles = await Article.findAndCountAll({
                where: { 
                    status: 'Published',
                    id: { [Op.ne]: featured.id }
                },
                order: [['published_date', 'DESC'], ['createdAt', 'DESC']],
                limit: limit,
                offset: offset
            });
            newsGrid = articles.rows;
            total = articles.count;
        }

        return { featured, newsGrid, total };
    },

    async getArticleBySlug(slug) {
        const article = await Article.findOne({ where: { slug, status: 'Published' } });
        if (!article) throw new Error('Article not found.');
        return article;
    },

    async findAllAdmin() {
        return await Article.findAll({ order: [['createdAt', 'DESC']] });
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

        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_UPDATE', entity_type: 'Article', entity_id: article.id, ip_address: ipAddress
        });

        return article;
    },

    async delete(id, author_id, ipAddress) {
        const article = await Article.findByPk(id);
        if (!article) throw new Error('Article not found.');

        await article.destroy();

        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_DELETE', entity_type: 'Article', entity_id: article.id, ip_address: ipAddress
        });

        return true;
    }
};

module.exports = articleService;