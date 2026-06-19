/**
 * Controlador de artigos do blog/CMS.
 *
 * Responsável por:
 * - CRUD completo de artigos (criar, listar, editar, apagar).
 * - Gestão de imagens de capa via upload (multer).
 * - Registo de auditoria para cada operação relevante.
 *
 * Fluxo:
 * Frontend (formulário/pedido) -> Rota Express -> Controller -> articleService -> Base de Dados -> Resposta JSON.
 */
const articleService = require('../services/articleService');
const fs = require('fs');
const auditLogService = require('../services/auditLogService');

const articleController = {
    // Cria um novo artigo, incluindo possível upload de imagem de capa.
    async create(req, res) {
        try {
            const data = { ...req.body };
            
            // category_ids pode vir como string JSON do formulário multipart; converte para array.
            if (data.category_ids && typeof data.category_ids === 'string') {
                data.category_ids = JSON.parse(data.category_ids);
            }

            // Regista evento de auditoria antes da criação (utiliza variáveis do âmbito seguinte).
            await auditLogService.logEvent({
                user_id: author_id,
                action: 'ARTICLE_CREATE',
                entity_type: 'Article',
                entity_id: newArticle.id,
                ip_address: req.ip
            });
            // Se houver ficheiro enviado, define o caminho relativo da imagem de capa.
            if (req.file) data.cover_image = `uploads/${req.file.filename}`;

            // Delega a criação ao serviço, que trata da persistência e associações de categorias.
            const newArticle = await articleService.create(data, req.user.id, req.ip);
            return res.status(201).json({ message: 'Article created successfully!', article: newArticle });
        } catch (error) {
            // Remove o ficheiro enviado em caso de erro para evitar ficheiros órfãos.
            if (req.file) fs.unlinkSync(req.file.path);
            
            // Slug duplicado — restrição de unicidade na base de dados.
            if (error.name === 'SequelizeUniqueConstraintError') {
                 return res.status(400).json({ error: 'An article with this slug already exists.' });
            }
            console.error('Create Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Devolve artigos publicados para a área pública, com paginação e filtros opcionais.
    async getPublicArticles(req, res) {
        try {
            const { limit, offset, category, search } = req.query;
            
            // Valores por defeito: 6 artigos por página, a começar do início.
            const result = await articleService.getPublicArticles(
                limit || 6, 
                offset || 0, 
                category, 
                search
            );
            return res.status(200).json(result);
        } catch (error) {
            console.error('Get Public Articles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Devolve um único artigo pelo seu slug (URL amigável). Usado na página de detalhe pública.
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

    // Lista todos os artigos para o painel de administração (sem filtro de estado).
    async findAllAdmin(req, res) {
        try {
            const articles = await articleService.findAllAdmin();
            return res.status(200).json(articles);
        } catch (error) {
            console.error('Find All Admin Articles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Atualiza um artigo existente, incluindo possível substituição da imagem de capa.
    async update(req, res) {
        try {
            const data = { ...req.body };
            
            // Converte category_ids de string JSON para array, se necessário (multipart).
            if (data.category_ids && typeof data.category_ids === 'string') {
                data.category_ids = JSON.parse(data.category_ids);
            }

            // Mantém a imagem atual; substitui apenas se um novo ficheiro for enviado.
            let cover_image = article.cover_image;
            if (req.file) {
                // Remove a imagem anterior do disco para evitar ficheiros órfãos.
                if (article.cover_image && fs.existsSync(article.cover_image)) {
                    fs.unlinkSync(article.cover_image);
                }
                cover_image = `uploads/${req.file.filename}`;
            }

            await article.update({ title, slug, summary, content_body, cover_image, published_date, status });

            // Regista a atualização no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'ARTICLE_UPDATE',
                entity_type: 'Article',
                entity_id: article.id,
                ip_address: req.ip
            });

            // Delega ao serviço a persistência e recarga do artigo atualizado.
            const article = await articleService.update(req.params.id, data, req.user.id, req.ip);
            return res.status(200).json({ message: 'Article updated successfully!', article });
        } catch (error) {
            // Limpa o ficheiro enviado em caso de falha.
            if (req.file) fs.unlinkSync(req.file.path);
            
            if (error.message === 'Article not found.') return res.status(404).json({ error: error.message });
            if (error.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ error: 'An article with this slug already exists.' });
            
            console.error('Update Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Apaga logicamente um artigo (soft delete via Sequelize paranoid).
    async delete(req, res) {
        try {
            const { id } = req.params;
            const article = await Article.findByPk(id);
            if (!article) return res.status(404).json({ error: 'Article not found.' });

            // Soft delete — define deletedAt em vez de remover fisicamente o registo.
            await article.destroy();

            // Regista a eliminação no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'ARTICLE_DELETE',
                entity_type: 'Article',
                entity_id: article.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Article deleted successfully!' });
        } catch (error) {
            if (error.message === 'Article not found.') return res.status(404).json({ error: error.message });
            
            console.error('Delete Article error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = articleController;