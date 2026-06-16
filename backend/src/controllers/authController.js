const authService = require('../services/authService');

const authController = {
    async register(req, res) {
        try {
            await authService.registerUser(req.body, req.user.id, req.ip);
            return res.status(201).json({ message: 'User created successfully! Activation E-mail sent' });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This email is already registered.' });
            }
            console.error('Register error:', error);
            return res.status(500).json({ error: error.message || 'Internal server error.' });
        }
    },

    async activateAccount(req, res) {
        try {
            await authService.activateAccount(req.body.token, req.body.newPassword, req.ip);
            return res.status(200).json({ message: 'Activation successful. Login now!' });
        } catch (error) {
            console.error('Activation error:', error);
            return res.status(400).json({ error: error.message || 'Activation error.' });
        }
    },

    async resendActivation(req, res) {
        try {
            await authService.resendActivation(req.body.id, req.user.id, req.ip);
            return res.status(200).json({ message: 'Activation E-mail resent!' });
        } catch (error) {
            console.error('Resend activation error:', error);
            return res.status(400).json({ error: error.message || 'Error resending email.' });
        }
    },

    async login(req, res) {
        try {
            const data = await authService.login(req.body.email, req.body.password, req.ip);

            // SUCESSO: O utilizador acertou a password! 
            // Vamos limpar as tentativas falhadas anteriores do IP dele para ele ter sempre 5 hipóteses novas da próxima vez.
            try {
                const loginRateLimiter = require('../middlewares/rateLimiter');
                if (loginRateLimiter && typeof loginRateLimiter.resetKey === 'function') {
                    await loginRateLimiter.resetKey(req.ip);
                }
            } catch (limiterError) {
                console.error('Erro ao resetar o rate limiter:', limiterError);
            }

            return res.status(200).json({
                message: 'Login success!', token: data.token, user: data.user
            });
        } catch (error) {
            console.error('Login error:', error);
            
            // ERRO: Não precisamos de incrementar nada manualmente aqui. 
            // O express-rate-limit já contou esta requisição automaticamente!

            const status = error.message.includes('found') || error.message.includes('password') || error.message.includes('activate') || error.message.includes('deactivated') ? 401 : 500;
            return res.status(status).json({ error: error.message || 'Internal server error.' });
        }
    },

    async forgotPassword(req, res) {
        try {
            await authService.forgotPassword(req.body.email, req.ip);
            return res.status(200).json({ message: 'If the email address exists in the system, you will receive a recovery link soon.' });
        } catch (error) {
            console.error('Forgot Password error:', error);
            return res.status(500).json({ error: 'Error processing the request.' });
        }
    },

    async resetPassword(req, res) {
        try {
            await authService.resetPassword(req.body.token, req.body.newPassword, req.ip);
            return res.status(200).json({ message: 'Password reset successfully! You can now log in.' });
        } catch (error) {
            console.error('Reset Password error:', error);
            return res.status(400).json({ error: error.message || 'Error resetting password.' });
        }
    }
};

module.exports = authController;