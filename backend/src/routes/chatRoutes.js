const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Reutiliza a pasta global de uploads do projeto
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'chat-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.webp', '.txt', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Tipo de ficheiro não suportado.'));
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50MB por anexo
    fileFilter
});

// Auth middleware for all routes
router.use(authMiddleware);

// Global permission for the entire Chat module
// If a user doesnt have the 'USE_CHAT' permission they cant access any of the routes below
router.use(checkPermission('USE_CHAT'));

// Find or start 1-to-1 chat
router.post('/', chatController.findOrCreateChat);

// List all chats
router.get('/', chatController.getMyChats);

// Send a message (Now using Multer to support attachments)
router.post('/messages', (req, res, next) => {
    upload.single('attachment')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'O ficheiro excede o limite de 50MB.' });
            if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Tipo de ficheiro não permitido por segurança.' });
            return res.status(400).json({ error: 'Erro ao fazer upload do anexo.' });
        } else if (err) {
            return res.status(500).json({ error: 'Erro interno no upload de ficheiros.' });
        }
        next();
    });
}, chatController.sendMessage);

// Load chat history
router.get('/:chat_id/messages', chatController.getChatMessages);

module.exports = router;