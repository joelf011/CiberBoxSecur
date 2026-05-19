const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Invalid token format' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = verified; 
        
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Expired or invalid token. Please, login again' });
    }
};

module.exports = authMiddleware;