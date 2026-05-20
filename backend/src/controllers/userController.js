const { User } = require('../models');
const bcrypt = require('bcrypt');
const auditLogController = require('./auditLogController');

const userController = {
    async getProfile(req, res) {
        try {
            const userId = req.user.id;

            // Get all atributes from db (except pw)
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error('Get Profile error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // UPDATE
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { name, password } = req.body; 

            const user = await User.findByPk(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            let updateData = { name };
            
            // Change pw
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            await user.update(updateData);

            // LOG: user changed theri own profile
            await auditLogController.logEvent({
                user_id: userId,
                action: password ? 'USER_UPDATE_PASSWORD' : 'USER_UPDATE_PROFILE',
                entity_type: 'User',
                entity_id: userId,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Update Profile error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // LIST all users (Admin)
    async getAllAdmin(req, res) {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(users);
        } catch (error) {
            console.error('Get All Users error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // ADMIN -> Update an user
    async updateAdmin(req, res) {
        try {
            const { id } = req.params;
            const { name, role_id, company_id, is_active } = req.body;

            const user = await User.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            await user.update({ name, role_id, company_id, is_active });

            // LOG: Admin chaged this account
            await auditLogController.logEvent({
                user_id: req.user.id,
                action: 'ADMIN_UPDATE_USER',
                entity_type: 'User',
                entity_id: user.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'User updated successfully by Admin!' });
        } catch (error) {
            console.error('Update User Admin error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) return res.status(404).json({ error: 'User not found' });

            await user.destroy();

            // LOG
            await auditLogController.logEvent({
                user_id: req.user.id, 
                action: 'ADMIN_DELETE_USER',
                entity_type: 'User',
                entity_id: user.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'User deleted successfully!' });
        } catch (error) {
            console.error('Delete User error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = userController;