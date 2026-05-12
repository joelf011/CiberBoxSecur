const { Role } = require('../models');

const roleController = {
    // CREATE
    async create(req, res) {
        try {
            const { name } = req.body;

            const newRole = await Role.create({ name });

            return res.status(201).json({ message: 'Role created successfully!', role: newRole });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This role name already exists.' });
            }
            console.error('Create Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ALL
    async findAll(req, res) {
        try {
            const roles = await Role.findAll();
            return res.status(200).json(roles);
        } catch (error) {
            console.error('Find All Roles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ONE
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);
            
            if (!role) {
                return res.status(404).json({ error: 'Role not found.' });
            }

            return res.status(200).json(role);
        } catch (error) {
            console.error('Find One Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const role = await Role.findByPk(id);
            
            if (!role) {
                return res.status(404).json({ error: 'Role not found.' });
            }

            await role.update({ name });

            return res.status(200).json({ message: 'Role updated successfully!', role });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This role name already exists.' });
            }
            console.error('Update Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);
            
            if (!role) {
                return res.status(404).json({ error: 'Role not found.' });
            }

            await role.destroy();

            return res.status(200).json({ message: 'Role deleted successfully!' });
        } catch (error) {
            console.error('Delete Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // RESTORE
    async restore(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id, { paranoid: false });
            
            if (!role) {
                return res.status(404).json({ error: 'Role not found.' });
            }

            if (role.deletedAt === null) {
                return res.status(400).json({ error: 'This role is already active.' });
            }

            await role.restore();

            return res.status(200).json({ message: 'Role restored successfully!', role });
        } catch (error) {
            console.error('Restore Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = roleController;