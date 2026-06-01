const { User } = require('../models');
const bcrypt = require('bcrypt');
const auditLogService = require('./auditLogService');

const userService = {
    async getProfile(userId) {
        const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
        if (!user) throw new Error('User not found');
        return user;
    },

    async updateProfile(userId, data, ipAddress) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        let updateData = { name: data.name };

        // Update avatar
        if (data.avatar !== undefined) {
            updateData.avatar = data.avatar;
        }

        // Change password
        if (data.newPassword) {
            // Current password
            if (!data.currentPassword) {
                throw new Error('To change your password, you must provide your current password.');
            }

            const isMatch = await bcrypt.compare(data.currentPassword, user.password);
            if (!isMatch) {
                throw new Error('A password atual está incorreta.');
            }

            updateData.password = await bcrypt.hash(data.newPassword, 10);
        }

        await user.update(updateData);

        await auditLogService.logEvent({
            user_id: userId, 
            action: data.newPassword ? 'USER_UPDATE_PASSWORD' : 'USER_UPDATE_PROFILE', 
            entity_type: 'User', 
            entity_id: userId, 
            ip_address: ipAddress
        });
        return user;
    },

    async getAllAdmin() {
        return await User.findAll({
            attributes: { exclude: ['password', 'avatar'] }, order: [['createdAt', 'DESC']]
        });
    },

    async updateAdmin(userId, data, adminId, ipAddress) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        let updateData = { name: data.name, email: data.email, role_id: data.role_id, company_id: data.company_id, is_active: data.is_active };
        
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        await user.update(updateData);

        await auditLogService.logEvent({
            user_id: adminId, action: 'ADMIN_UPDATE_USER', entity_type: 'User', entity_id: user.id, ip_address: ipAddress
        });
        return user;
    },

    async deleteUser(userId, adminId, ipAddress) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        await user.destroy();

        await auditLogService.logEvent({
            user_id: adminId, action: 'ADMIN_DELETE_USER', entity_type: 'User', entity_id: user.id, ip_address: ipAddress
        });
        return true;
    }
};

module.exports = userService;