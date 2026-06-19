/**
 * Rotas de Artigos (Blog/Notícias).
 *
 * Responsável por:
 * - Expor artigos publicados ao público (sem autenticação).
 * - Gerir artigos no painel de administração (CRUD protegido).
 *
 * Fluxo:
 * Frontend -> API -> authMiddleware -> permissionMiddleware -> uploadMiddleware -> Controller -> Service -> BD.
 */
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// --- ROTAS PÚBLICAS (acessíveis sem autenticação) ---

// Lista artigos publicados com paginação, pesquisa e filtro por categoria.
router.get('/public', articleController.getPublicArticles);

// Obtém um artigo publicado pelo slug (URL amigável).
router.get('/public/:slug', articleController.getArticleBySlug);

// --- ROTAS PRIVADAS (Painel de Administração) ---

// Lista todos os artigos (incluindo rascunhos) para gestão no backoffice.
router.get('/', authMiddleware, checkPermission('MANAGE_ARTICLES'), articleController.findAllAdmin);

// Cria um novo artigo. Cadeia: Auth -> Permissão -> Upload da imagem de capa.
router.post('/', authMiddleware, checkPermission('CREATE_ARTICLE'), upload.single('cover_image'), articleController.create);

// Atualiza um artigo existente. Permite substituir a imagem de capa.
router.put('/:id', authMiddleware, checkPermission('UPDATE_ARTICLE'), upload.single('cover_image'), articleController.update);

// Remove permanentemente um artigo e as suas associações a categorias.
router.delete('/:id', authMiddleware, checkPermission('DELETE_ARTICLE'), articleController.delete);

module.exports = router;