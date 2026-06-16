const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Bloqueia à 5ª tentativa consecutiva
  message: { 
    error: 'Demasiadas tentativas de login falhadas. O seu IP foi bloqueado por 15 minutos.' 
  },
  standardHeaders: true, 
  legacyHeaders: false,
  // Removido o skip dinâmico para não quebrar a assinatura da função do Express
});

module.exports = loginRateLimiter;