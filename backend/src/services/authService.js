const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User, Role, Permission  } = require('../models');
const emailService = require('./emailService');
const auditLogService = require('./auditLogService');

/**
 * Responsável por:
 * - Gerir registo, ativação, login e recuperação de palavra-passe.
 * - Emitir tokens JWT com permissões para autorização no backend e no frontend.
 *
 * Fluxo:
 * AuthController -> Service -> Users/Roles/Permissions -> E-mail/JWT -> Resposta à UI.
 */
const authService = {
    async registerUser(data, adminId, ipAddress) {
        const { name, email, phone, role_id } = data; 
        const activationToken = crypto.randomBytes(32).toString('hex');

        // O token temporário permite que o utilizador defina a password no frontend.
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);

        const newUser = await User.create({
            name, 
            email, 
            phone,
            role_id: role_id || null,
            activation_token: activationToken, 
            token_expires_at: tokenExpiresAt, 
            is_active: false
        });

        await auditLogService.logEvent({
            user_id: adminId, action: 'USER_REGISTER', entity_type: 'User', entity_id: newUser.id, ip_address: ipAddress
        });

        // O envio segue em background para não prender a resposta HTTP ao SMTP.
        emailService.sendActivationEmail(newUser.email, newUser.name, activationToken)
            .catch(err => console.error("Erro ao enviar email em background:", err));
        return newUser;
    },

    async activateAccount(token, newPassword, ipAddress) {
        // O mesmo campo de token suporta ativação inicial e recuperação de password.
        const user = await User.findOne({ where: { activation_token: token } });

        if (!user) throw new Error('Invalid token or user not found.');
        if (new Date() > new Date(user.token_expires_at)) throw new Error('This activation link has expired.');

        user.password = await bcrypt.hash(newPassword, 10);
        user.activation_token = null;
        user.token_expires_at = null;
        user.is_active = true;
        await user.save();

        await auditLogService.logEvent({
            user_id: user.id, action: 'USER_ACTIVATED_ACCOUNT', entity_type: 'User', entity_id: user.id, ip_address: ipAddress
        });
        return user;
    },

    async resendActivation(userId, adminId, ipAddress) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found.');
        if (user.password) throw new Error('This account is already activated.');

        // Gera novo convite e invalida o token anterior antes de reenviar o e-mail.
        const newActivationToken = crypto.randomBytes(32).toString('hex');
        const newTokenExpiresAt = new Date();
        newTokenExpiresAt.setHours(newTokenExpiresAt.getHours() + 24);

        user.activation_token = newActivationToken;
        user.token_expires_at = newTokenExpiresAt;
        user.is_active = false; 
        await user.save();

        await auditLogService.logEvent({
            user_id: adminId, action: 'ADMIN_RESENT_ACTIVATION_EMAIL', entity_type: 'User', entity_id: user.id, ip_address: ipAddress
        });

        emailService.sendActivationEmail(user.email, user.name, newActivationToken)
            .catch(err => console.error("Erro ao reenviar email em background:", err));
        return user;
    },

    async login(email, password, ipAddress) {
        // Carrega cargo e permissões numa só query para montar o JWT autorizado.
        const user = await User.findOne({
            where: { email },
            include: [{model: Role,
                include: [{
                    model: Permission,
                    attributes: ['name']
                }]
            }]
        });

        if (!user) {
            await auditLogService.logEvent({ user_id: null, action: 'USER_LOGIN_FAILED_NOT_FOUND', entity_type: 'User', entity_id: null, ip_address: ipAddress });
            throw new Error('User not found.');
        }
        if (!user.is_active) {
            await auditLogService.logEvent({ user_id: user.id, action: 'USER_LOGIN_BLOCKED_INACTIVE', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });
            throw new Error('This account is deactivated.');
        }
        if (!user.password) {
            await auditLogService.logEvent({ user_id: user.id, action: 'USER_LOGIN_FAILED_NOT_ACTIVATED', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });
            throw new Error('Please, activate your account using the link sent by email.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await auditLogService.logEvent({ user_id: user.id, action: 'USER_LOGIN_FAILED_WRONG_PASSWORD', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });
            throw new Error('Wrong password.');
        }

        // As permissões seguem no token para acelerar decisões de UI e middlewares.
        const userPermissions = user.Role && user.Role.Permissions 
            ? user.Role.Permissions.map(p => p.name) 
            : [];

        const token = jwt.sign(
            { 
                id: user.id, 
                role_id: user.role_id, 
                company_id: user.company_id,
                permissions: userPermissions // Usado pelo permissionMiddleware e pela navegação do backoffice.
            },
            process.env.JWT_SECRET, { expiresIn: '8h' }
        );

        await auditLogService.logEvent({ user_id: user.id, action: 'USER_LOGIN_SUCCESS', entity_type: 'User', entity_id: user.id, ip_address: ipAddress });

        return { 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                role_id: user.role_id,
                role_name: user.Role ? user.Role.name : null,
                permissions: userPermissions
            } 
        };
    },

    async forgotPassword(email, ipAddress) {
        const user = await User.findOne({ where: { email } });
        
        // Resposta neutra evita enumeração de contas através do endpoint público.
        if (!user) return true; 

        // Token curto para limitar a janela de risco do fluxo de recuperação.
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

        user.activation_token = resetToken;
        user.token_expires_at = tokenExpiresAt;
        await user.save();

        await auditLogService.logEvent({ 
            user_id: user.id, action: 'USER_FORGOT_PASSWORD_REQUEST', entity_type: 'User', entity_id: user.id, ip_address: ipAddress 
        });

        await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
        return true;
    },

    async resetPassword(token, newPassword, ipAddress) {
        // Valida o token recebido pelo frontend antes de alterar a password persistida.
        const user = await User.findOne({ where: { activation_token: token } });
        
        if (!user) throw new Error('Token inválido ou utilizador não encontrado.');
        if (new Date() > new Date(user.token_expires_at)) throw new Error('Este link de recuperação já expirou.');

        user.password = await bcrypt.hash(newPassword, 10);
        user.activation_token = null;
        user.token_expires_at = null;
        await user.save();

        await auditLogService.logEvent({ 
            user_id: user.id, action: 'USER_PASSWORD_RESET_SUCCESS', entity_type: 'User', entity_id: user.id, ip_address: ipAddress 
        });
        
        return true;
    }
};

module.exports = authService;
