const { Article } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const auditLogController = require('./auditLogController');

const articleController = {
    // CREATE
    async create(req, res) {
        try {
            const author_id = req.user.id; 
            const { title, slug, summary, content_body, published_date, status } = req.body;
            const cover_image = req.file ? `uploads/${req.file.filename}` : null;

            const newArticle = await Article.create({
                author_id, title, slug, summary, content_body, cover_image,
                published_date: published_date || null,
                status: status || 'Draft'
            });

            // LOG: article created
            await auditLogController.logEvent({
                user_id: author_id,
                action: 'ARTICLE_CREATE',
                entity_type: 'Article',
                entity_id: newArticle.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Article created successfully!', article: newArticle });
        } catch (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            if (error.name === 'SequelizeUniqueConstraintError') {
                 return res.status(400).json({ error: 'An article with this slug already exists.' });
            }
            console.error('Create Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ALL
    async getPublicArticles(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 6;
            const offset = parseInt(req.query.offset) || 0;

            // FEATURE
            const featured = await Article.findOne({
                where: { status: 'Published' },
                order: [['published_date', 'DESC'], ['createdAt', 'DESC']]
            });

            let newsGrid = [];
            let total = 0;

            if (featured) {
                // GRID
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

            return res.status(200).json({ featured, newsGrid, total });
        } catch (error) {
            console.error('Get Public Articles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ONE
    async getArticleBySlug(req, res) {
        try {
            const { slug } = req.params;
            const article = await Article.findOne({ where: { slug, status: 'Published' } });

            if (!article) return res.status(404).json({ error: 'Article not found.' });
            return res.status(200).json(article);
        } catch (error) {
            console.error('Get Article by Slug error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LIST ALL
    async findAllAdmin(req, res) {
        try {
            const articles = await Article.findAll({ order: [['createdAt', 'DESC']] });
            return res.status(200).json(articles);
        } catch (error) {
            console.error('Find All Admin Articles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // EDIT ARTICLE
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, slug, summary, content_body, published_date, status } = req.body;
            
            const article = await Article.findByPk(id);
            if (!article) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(404).json({ error: 'Article not found.' });
            }

            let cover_image = article.cover_image;
            if (req.file) {
                if (article.cover_image && fs.existsSync(article.cover_image)) {
                    fs.unlinkSync(article.cover_image);
                }
                cover_image = `uploads/${req.file.filename}`;
            }

            await article.update({ title, slug, summary, content_body, cover_image, published_date, status });

            // LOG: update article
            await auditLogController.logEvent({
                user_id: req.user.id,
                action: 'ARTICLE_UPDATE',
                entity_type: 'Article',
                entity_id: article.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Article updated successfully!', article });
        } catch (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'An article with this slug already exists.' });
            }
            console.error('Update Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const article = await Article.findByPk(id);
            if (!article) return res.status(404).json({ error: 'Article not found.' });

            await article.destroy();

            // LOG: article deleted
            await auditLogController.logEvent({
                user_id: req.user.id,
                action: 'ARTICLE_DELETE',
                entity_type: 'Article',
                entity_id: article.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Article deleted successfully!' });
        } catch (error) {
            console.error('Delete Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = articleController;