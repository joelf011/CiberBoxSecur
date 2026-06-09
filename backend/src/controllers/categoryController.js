const { Category } = require('../models');
const auditLogService = require('../services/auditLogService');

// Automatic slug ("NIS 2 alerts -> nis2-alerts")
const generateSlug = (text) => {
    return text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const categoryController = {
    // LIST all
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

    // CREATE
    async create(req, res) {
        try {
            const { name } = req.body;
            let { slug } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Category name is required.' });
            }

            if (!slug) slug = generateSlug(name);

            const newCategory = await Category.create({ name, slug });

            // LOG: category created
            await auditLogService.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'CATEGORY_CREATE',
                entity_type: 'Category',
                entity_id: newCategory.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Category created successfully!', data: newCategory });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'A category with this slug already exists.' });
            }
            console.error('Create Category error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE CATEGORY
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            let { slug } = req.body;

            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ error: 'Category not found.' });

            if (name && !slug) slug = generateSlug(name);

            await category.update({ name, slug: slug || category.slug });

            // LOG: Category updated
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

    // DELETE
    async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) return res.status(404).json({ error: 'Category not found.' });

            await category.destroy();

            // LOG: Category deleted
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