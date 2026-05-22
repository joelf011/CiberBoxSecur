const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const emailService = require('./emailService');
const auditLogController = require('../controllers/auditLogController');

const authService = {
    async registerUser(data, adminId, ipAddress) {
        const { name, email, role_id } = data;
        const activationToken = crypto.randomBytes(32).toString('hex');

        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);

        const newUser = await User.create({
            name, email, role_id: role_id || null,
            activation_token: activationToken, token_expires_at: tokenExpiresAt, is_active: true
        });

        await auditLogController.logEvent({
            user_id: adminId, action: 'USER_REGISTER', entity_type: 'User', entity_id: newUser.id, ip_address: ipAddress
        });

        await emailService.sendActivationEmail(newUser.email, newUser.name, activationToken);
        return newUser;
    },

    async activateAccount(token, newPassword, ipAddress) {
        const user = await User.findOne({ where: { activation_token: token } });

        if (!user) throw new Error('Invalid token or user not found.');
        if (new Date() > new Date(user.token_expires_at)) throw new Error('This activation link has expired.');

        user.password = await bcrypt.hash(newPassword, 10);
        user.activation_token = null;
        user.token_expires_at = null;
        await user.save();

        await auditLogController.logEvent({
            user_id: user.id, action: 'USER_ACTIVATED_ACCOUNT', entity_type: 'User', entity_id: user.id, ip_address: ipAddress
        });
        return user;
    },

    async resendActivation(userId, adminId, ipAddress) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found.');
        if (user.password) throw new Error('This account is already activated.');

        const newActivationToken = crypto.randomBytes(32).toString('hex');
        const newTokenExpiresAt = new Date();
        newTokenExpiresAt.setHours(newTokenExpiresAt.getHours() + 24);

        user.activation_token = newActivationToken;
        user.token_expires_at = newTokenExpiresAt;
        await user.save();

        await auditLogController.logEvent({
            user_id: adminId, action: 'ADMIN_RESENT_ACTIVATION_EMAIL', entity_type: 'User', entity_id: user.id, ip_address: ipAddress
        });

        await emailService.sendActivationEmail(user.email, user.name, newActivationToken);
        return user;
    },

    async login(email, password, ipAddress) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            await auditLogController.logEvent({ user_id: null, action: 'USER_LOGIN_FAILED_NOT_FOUND', entity_type: 'User', entity_id: null, ip_address: ipAddress });
            throw new Error('User not found.');
        }
        if (!user.is_active) {
            await auditLogController.logEvent({ user_id: user.id, action: 'USER_LOGIN_BLOCKED_INACTIVE', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });
            throw new Error('This account is deactivated.');
        }
        if (!user.password) {
            await auditLogController.logEvent({ user_id: user.id, action: 'USER_LOGIN_FAILED_NOT_ACTIVATED', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });
            throw new Error('Please, activate your account using the link sent by email.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await auditLogController.logEvent({ user_id: user.id, action: 'USER_LOGIN_FAILED_WRONG_PASSWORD', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });
            throw new Error('Wrong password.');
        }

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id, company_id: user.company_id },
            process.env.JWT_SECRET, { expiresIn: '8h' }
        );

        await auditLogController.logEvent({ user_id: user.id, action: 'USER_LOGIN_SUCCESS', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });

        return { token, user: { id: user.id, name: user.name, role_id: user.role_id } };
    },

    async forgotPassword(email, ipAddress) {
        const user = await User.findOne({ where: { email } });
        
        if (!user) return true; 

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

        user.activation_token = resetToken;
        user.token_expires_at = tokenExpiresAt;
        await user.save();

        await auditLogController.logEvent({ 
            user_id: user.id, action: 'USER_FORGOT_PASSWORD_REQUEST', entity_type: 'User', entity_id: user.id, ip_address: ipAddress 
        });

        await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
        return true;
    },

    async resetPassword(token, newPassword, ipAddress) {
        const user = await User.findOne({ where: { activation_token: token } });
        
        if (!user) throw new Error('Token inválido ou utilizador não encontrado.');
        if (new Date() > new Date(user.token_expires_at)) throw new Error('Este link de recuperação já expirou.');

        user.password = await bcrypt.hash(newPassword, 10);
        user.activation_token = null;
        user.token_expires_at = null;
        await user.save();

        await auditLogController.logEvent({ 
            user_id: user.id, action: 'USER_PASSWORD_RESET_SUCCESS', entity_type: 'User', entity_id: user.id, ip_address: ipAddress 
        });
        
        return true;
    }
};

module.exports = authService;