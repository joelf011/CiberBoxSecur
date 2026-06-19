/**
 * Controlador de Autenticação.
 *
 * Responsável por:
 * - Registo de novos utilizadores (com envio de e-mail de ativação).
 * - Ativação de contas via token único.
 * - Login com validação de credenciais e emissão de JWT.
 * - Recuperação e redefinição de palavra-passe.
 *
 * Fluxo:
 * Frontend (formulário) -> API (este controlador) -> authService -> Base de Dados / E-mail -> Resposta JSON.
 *
 * Segurança:
 * - O rate limiter (express-rate-limit) limita tentativas de login por IP.
 * - Tokens de ativação e recuperação são de uso único e com validade limitada.
 */
const authService = require('../services/authService');

const authController = {
    // Regista um novo utilizador. Apenas acessível por utilizadores autenticados (admin cria contas).
    async register(req, res) {
        try {
            await authService.registerUser(req.body, req.user.id, req.ip);
            return res.status(201).json({ message: 'User created successfully! Activation E-mail sent' });
        } catch (error) {
            // O Sequelize lança este erro quando o e-mail já existe na tabela (campo único).
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This email is already registered.' });
            }
            console.error('Register error:', error);
            return res.status(500).json({ error: error.message || 'Internal server error.' });
        }
    },

    // Ativa a conta através do token enviado por e-mail e define a palavra-passe escolhida pelo utilizador.
    async activateAccount(req, res) {
        try {
            await authService.activateAccount(req.body.token, req.body.newPassword, req.ip);
            return res.status(200).json({ message: 'Activation successful. Login now!' });
        } catch (error) {
            console.error('Activation error:', error);
            return res.status(400).json({ error: error.message || 'Activation error.' });
        }
    },

    // Reenvia o e-mail de ativação para utilizadores que não completaram o registo.
    async resendActivation(req, res) {
        try {
            await authService.resendActivation(req.body.id, req.user.id, req.ip);
            return res.status(200).json({ message: 'Activation E-mail resent!' });
        } catch (error) {
            console.error('Resend activation error:', error);
            return res.status(400).json({ error: error.message || 'Error resending email.' });
        }
    },

    // Autentica o utilizador e devolve um JWT válido para sessões subsequentes.
    async login(req, res) {
        try {
            const data = await authService.login(req.body.email, req.body.password, req.ip);

            // Login bem-sucedido: limpa o contador do rate limiter para este IP,
            // garantindo que o utilizador volta a ter o limite máximo de tentativas.
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
            
            // O express-rate-limit já incrementou o contador automaticamente ao receber o pedido,
            // por isso não é necessário contabilizar a tentativa falhada manualmente.

            // Devolve 401 para erros de credenciais/conta; 500 para falhas inesperadas.
            const status = error.message.includes('found') || error.message.includes('password') || error.message.includes('activate') || error.message.includes('deactivated') ? 401 : 500;
            return res.status(status).json({ error: error.message || 'Internal server error.' });
        }
    },

    // Inicia o fluxo de recuperação de palavra-passe. A resposta é sempre genérica para não revelar se o e-mail existe.
    async forgotPassword(req, res) {
        try {
            await authService.forgotPassword(req.body.email, req.ip);
            return res.status(200).json({ message: 'If the email address exists in the system, you will receive a recovery link soon.' });
        } catch (error) {
            console.error('Forgot Password error:', error);
            return res.status(500).json({ error: 'Error processing the request.' });
        }
    },

    // Redefine a palavra-passe usando o token de recuperação enviado por e-mail.
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