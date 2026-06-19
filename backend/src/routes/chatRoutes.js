/**
 * Rotas do módulo de Chat.
 *
 * Responsável por:
 * - Criar ou encontrar conversas 1-para-1 entre utilizadores.
 * - Enviar mensagens com suporte a anexos (ficheiros até 50MB).
 * - Listar conversas e carregar o histórico de mensagens.
 *
 * Todas as rotas exigem autenticação e a permissão global USE_CHAT.
 * O upload de anexos é gerido por Multer com validação de tipo e tamanho de ficheiro.
 *
 * Fluxo de mensagem com anexo:
 * Frontend -> Multer (validação/upload) -> Controller -> Service -> BD + WebSocket.
 */
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

// Configuração do armazenamento Multer com nome único por ficheiro.
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'chat-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro de extensões permitidas para proteger contra ficheiros maliciosos.
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

// Aplica autenticação obrigatória a todas as rotas do chat.
router.use(authMiddleware);

// Permissão global do módulo de Chat. Sem USE_CHAT, nenhuma rota abaixo é acessível.
router.use(checkPermission('USE_CHAT'));

// Encontra ou cria uma conversa 1-para-1 com outro utilizador.
router.post('/', chatController.findOrCreateChat);

// Lista todas as conversas do utilizador autenticado.
router.get('/', chatController.getMyChats);

// Envia uma mensagem. O Multer trata o upload do anexo antes de passar ao controlador.
// Os erros do Multer são interceptados para devolver mensagens claras ao frontend.
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

// Carrega o histórico de mensagens de uma conversa específica.
router.get('/:chat_id/messages', chatController.getChatMessages);

module.exports = router;