/**
 * Middleware de autenticação por JWT.
 *
 * Responsável por:
 * - Extrair o token Bearer do cabeçalho Authorization.
 * - Verificar a validade e assinatura do token com a chave JWT_SECRET.
 * - Injetar os dados do utilizador (payload) em req.user para os middlewares/controllers seguintes.
 *
 * Fluxo:
 * Pedido → Extrai token → jwt.verify() → req.user → next() ou 401.
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied' });
    }

    // Extrai o token do formato "Bearer <token>".
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Invalid token format' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Disponibiliza o payload (id, role_id, company_id, etc.) para os próximos handlers.
        req.user = verified; 
        
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Expired or invalid token. Please, login again' });
    }
};

module.exports = authMiddleware;