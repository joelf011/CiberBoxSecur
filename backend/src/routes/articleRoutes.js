const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// --- PUBLIC ROUTES ---
router.get('/public', articleController.getPublicArticles);
router.get('/public/:slug', articleController.getArticleBySlug);

// --- PRIVATE ROUTES (Admin / Dashboard) ---
router.get('/admin', authMiddleware, articleController.findAllAdmin);
router.post('/', authMiddleware, upload.single('cover_image'), articleController.create);
router.put('/:id', authMiddleware, upload.single('cover_image'), articleController.update);
router.delete('/:id', authMiddleware, articleController.delete);

module.exports = router;