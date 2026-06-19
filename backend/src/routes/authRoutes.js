/**
 * Rotas de Autenticação.
 *
 * Responsável por:
 * - Registo de utilizadores (feito por admin autenticado).
 * - Ativação de contas via token enviado por e-mail.
 * - Login com rate limiting para proteção contra força bruta.
 * - Recuperação e redefinição de palavra-passe.
 *
 * Fluxo de registo:
 * Admin cria utilizador -> E-mail de ativação enviado -> Utilizador define palavra-passe -> Conta ativa.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const loginRateLimiter = require('../middlewares/rateLimiter');

// --- ROTAS PROTEGIDAS (apenas administradores) ---

// Regista um novo utilizador. Apenas admins autenticados com permissão CREATE_USER.
router.post('/register', authMiddleware, checkPermission('CREATE_USER'), authController.register);

// Reenvia o e-mail de ativação para utilizadores que ainda não ativaram a conta.
router.post('/resend-activation', authMiddleware, checkPermission('CREATE_USER'), authController.resendActivation);

// --- ROTAS PÚBLICAS ---

// Autentica o utilizador e devolve um JWT. Protegido por rate limiter.
router.post('/login', loginRateLimiter, authController.login);

// Ativa a conta do utilizador após clicar no link enviado por e-mail.
router.post('/activate', authController.activateAccount);

// Solicita o envio de um e-mail para recuperação de palavra-passe.
router.post('/forgot-password', authController.forgotPassword);

// Redefine a palavra-passe utilizando o token de recuperação.
router.post('/reset-password', authController.resetPassword);

module.exports = router;