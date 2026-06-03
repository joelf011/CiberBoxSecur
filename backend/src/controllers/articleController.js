const articleService = require('../services/articleService');
const fs = require('fs');

const articleController = {
    // CREATE
    async create(req, res) {
        try {
            const data = { ...req.body };
            if (req.file) data.cover_image = `uploads/${req.file.filename}`;

            const newArticle = await articleService.create(data, req.user.id, req.ip);
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

            const result = await articleService.getPublicArticles(limit, offset);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Get Public Articles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ONE
    async getArticleBySlug(req, res) {
        try {
            const article = await articleService.getArticleBySlug(req.params.slug);
            return res.status(200).json(article);
        } catch (error) {
            if (error.message === 'Article not found.') return res.status(404).json({ error: error.message });
            
            console.error('Get Article by Slug error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LIST ALL
    async findAllAdmin(req, res) {
        try {
            const articles = await articleService.findAllAdmin();
            return res.status(200).json(articles);
        } catch (error) {
            console.error('Find All Admin Articles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // EDIT ARTICLE
    async update(req, res) {
        try {
            const data = { ...req.body };
            if (req.file) data.cover_image = `uploads/${req.file.filename}`;

            const article = await articleService.update(req.params.id, data, req.user.id, req.ip);
            return res.status(200).json({ message: 'Article updated successfully!', article });
        } catch (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            
            if (error.message === 'Article not found.') return res.status(404).json({ error: error.message });
            if (error.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ error: 'An article with this slug already exists.' });
            
            console.error('Update Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            await articleService.delete(req.params.id, req.user.id, req.ip);
            return res.status(200).json({ message: 'Article deleted successfully!' });
        } catch (error) {
            if (error.message === 'Article not found.') return res.status(404).json({ error: error.message });
            
            console.error('Delete Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = articleController;