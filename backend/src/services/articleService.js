/**
 * Responsável por:
 * - Gerir a persistência de artigos e respetivas categorias.
 * - Preparar listagens públicas e administrativas para os controllers.
 *
 * Fluxo:
 * Controller -> Service -> Sequelize -> Articles/Categories -> Resposta ao frontend.
 */
const { Article, Category } = require('../models'); // Categoria necessária para devolver associações já prontas para a UI.
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
        // Cria primeiro o artigo para obter o ID usado na relação M:N com categorias.
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
            // Atualiza a tabela pivot ArticleCategories com as categorias escolhidas no backoffice.
            await newArticle.setCategories(data.category_ids);
        }

        // Mantém rastreabilidade administrativa de alterações ao conteúdo público.
        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_CREATE', entity_type: 'Article', entity_id: newArticle.id, ip_address: ipAddress
        });

        return await Article.findByPk(newArticle.id, { include: includeCategory });
    },

    async getPublicArticles(limit = 6, offset = 0, categoryId = null, search = null) {
        // A área pública só consome artigos publicados.
        const whereClause = { status: 'Published' };

        // Pesquisa textual aplicada na query SQL antes de devolver a grelha.
        if (search) {
            whereClause.title = { [Op.substring]: search };
        }

        const categoryInclude = {
            model: Category,
            attributes: ['id', 'name', 'slug'],
            through: { attributes: [] }
        };

        // A categoria filtra através da relação M:N entre artigos e categorias.
        if (categoryId) {
            categoryInclude.where = { id: categoryId };
        }

        const isFiltering = search || categoryId;
        let featured = null;

        // O artigo em destaque só aparece na primeira página sem filtros ativos.
        if (!isFiltering && offset == 0) {
            featured = await Article.findOne({
                where: { status: 'Published' },
                include: [{ model: Category, attributes: ['id', 'name', 'slug'], through: { attributes: [] } }],
                order: [['published_date', 'DESC'], ['createdAt', 'DESC']]
            });
        }

        // A grelha exclui o destaque para evitar duplicação visual no frontend.
        const gridWhere = { ...whereClause };
        if (featured) {
            gridWhere.id = { [Op.ne]: featured.id }; // Exclui o artigo já apresentado em destaque.
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
            // Substitui a imagem física apenas quando o upload trouxe uma nova capa.
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
            // Sincroniza a relação M:N com o conjunto enviado pelo formulário do backoffice.
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

        // Remove ligações da tabela pivot antes do soft delete do artigo.
        await article.setCategories([]);
        await article.destroy();

        await auditLogService.logEvent({
            user_id: author_id, action: 'ARTICLE_DELETE', entity_type: 'Article', entity_id: article.id, ip_address: ipAddress
        });

        return true;
    }
};

module.exports = articleService;
