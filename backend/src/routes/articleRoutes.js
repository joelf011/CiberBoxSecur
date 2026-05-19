const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// --- PUBLIC ROUTES ---
router.get('/public', articleController.getPublicArticles);
router.get('/public/:slug', articleController.getArticleBySlug);

// --- PRIVATE ROUTES (Admin / Dashboard) ---
router.get('/admin', authMiddleware, checkPermission('MANAGE_ARTICLES'), articleController.findAllAdmin);

// Auth -> Permission -> Upload
router.post('/', authMiddleware, checkPermission('CREATE_ARTICLE'), upload.single('cover_image'), articleController.create);
router.put('/:id', authMiddleware, checkPermission('UPDATE_ARTICLE'), upload.single('cover_image'), articleController.update);

router.delete('/:id', authMiddleware, checkPermission('DELETE_ARTICLE'), articleController.delete);

module.exports = router;