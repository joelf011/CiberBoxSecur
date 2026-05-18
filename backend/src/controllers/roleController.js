const { Role, Permission, sequelize } = require('../models');

const roleController = {
    // CREATE
    async create(req, res) {
        // Change 2 tables (Roles and Role_Permissions)
        // Rollback
        const t = await sequelize.transaction();

        try {
            const { name, permissions } = req.body;

            // Base Role
            const newRole = await Role.create({ name }, { transaction: t });

            // Permissions
            if (permissions && Array.isArray(permissions) && permissions.length > 0) {
                // Sequelize: setPermissions -> rows in the join table
                await newRole.setPermissions(permissions, { transaction: t });
            }

            await t.commit();

            // Find the newly created role, but with the permissions to return it to the Frontend
            const roleWithPermissions = await Role.findByPk(newRole.id, {
                include: { model: Permission, attributes: ['id', 'name'] }
            });

            return res.status(201).json({ message: 'Role created successfully!', role: roleWithPermissions });
        } catch (error) {
            await t.rollback(); // Rollback if there is an error
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
            const roles = await Role.findAll({
                include: {
                    model: Permission,
                    attributes: ['id', 'name'],
                    through: { attributes: [] } // Hide join table from json
                },
                order: [['name', 'ASC']]
            });
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
            const role = await Role.findByPk(id, {
                include: {
                    model: Permission,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            });
            
            if (!role) return res.status(404).json({ error: 'Role not found.' });

            return res.status(200).json(role);
        } catch (error) {
            console.error('Find One Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { name, permissions } = req.body;

            const role = await Role.findByPk(id);
            
            if (!role) {
                await t.rollback();
                return res.status(404).json({ error: 'Role not found.' });
            }

            // Update name
            if (name) {
                await role.update({ name }, { transaction: t });
            }

            // Update permissions
            if (permissions && Array.isArray(permissions)) {
                await role.setPermissions(permissions, { transaction: t });
            }

            await t.commit();

            const updatedRole = await Role.findByPk(id, {
                include: { model: Permission, attributes: ['id', 'name'] }
            });

            return res.status(200).json({ message: 'Role updated successfully!', role: updatedRole });
        } catch (error) {
            await t.rollback();
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