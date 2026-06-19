/**
 * Controlador de categorias de artigos.
 *
 * Responsável por:
 * - CRUD completo de categorias utilizadas nos artigos do blog/CMS.
 * - Geração automática de slug a partir do nome.
 * - Registo de auditoria em cada operação.
 *
 * Fluxo:
 * Frontend (gestão de categorias) -> Rota Express -> Controller -> Modelo Category (Sequelize) -> Base de Dados -> Resposta JSON.
 */
const { Category } = require('../models');
const auditLogService = require('../services/auditLogService');

// Gera slug automático a partir do nome (ex: "NIS 2 alerts" -> "nis2-alerts").
// Remove acentos, caracteres especiais e normaliza espaços em hífens.
const generateSlug = (text) => {
    return text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const categoryController = {
    // Lista todas as categorias por ordem alfabética.
    async getAll(req, res) {
        try {
            const categories = await Category.findAll({
                order: [['name', 'ASC']]
            });
            return res.status(200).json(categories);
        } catch (error) {
            console.error('Get Categories error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Cria uma nova categoria; gera slug automaticamente se não for fornecido.
    async create(req, res) {
        try {
            const { name } = req.body;
            let { slug } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Category name is required.' });
            }

            // Gera slug a partir do nome caso o frontend não envie um slug personalizado.
            if (!slug) slug = generateSlug(name);

            const newCategory = await Category.create({ name, slug });

            // Regista a criação no log de auditoria (req.user pode ser null em contextos sem auth).
            await auditLogService.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'CATEGORY_CREATE',
                entity_type: 'Category',
                entity_id: newCategory.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Category created successfully!', data: newCategory });
        } catch (error) {
            // Slug duplicado — restrição de unicidade na base de dados.
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'A category with this slug already exists.' });
            }
            console.error('Create Category error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Atualiza uma categoria existente; regenera slug se o nome mudar sem slug explícito.
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            let { slug } = req.body;

            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ error: 'Category not found.' });

            // Se o nome foi alterado mas não foi fornecido slug, gera um novo automaticamente.
            if (name && !slug) slug = generateSlug(name);

            await category.update({ name, slug: slug || category.slug });

            // Regista a atualização no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'CATEGORY_UPDATE',
                entity_type: 'Category',
                entity_id: category.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Category updated successfully!', data: category });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This slug is already in use.' });
            }
            console.error('Update Category error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Remove uma categoria da base de dados.
    async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) return res.status(404).json({ error: 'Category not found.' });

            await category.destroy();

            // Regista a eliminação no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'CATEGORY_DELETE',
                entity_type: 'Category',
                entity_id: category.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Category deleted successfully!' });
        } catch (error) {
            console.error('Delete Category error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = categoryController;