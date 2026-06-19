/**
 * Rate limiter para a rota de login.
 *
 * Protege contra ataques de força bruta limitando o número de tentativas
 * por IP dentro de uma janela temporal de 15 minutos.
 *
 * Utilizado em: authRoutes (POST /api/auth/login).
 */

const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos.
  max: 5, // Máximo de 5 tentativas por IP antes de bloquear.
  message: { 
    error: 'Demasiadas tentativas de login falhadas. O seu IP foi bloqueado por 15 minutos.' 
  },
  // Envia cabeçalhos RateLimit-* conforme a norma IETF; desativa os X-RateLimit-* legados.
  standardHeaders: true, 
  legacyHeaders: false,
});

module.exports = loginRateLimiter;