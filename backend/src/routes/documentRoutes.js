const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// 'upload.single('file')' Before controller
router.post('/', authMiddleware, upload.single('file'), documentController.create);

router.get('/', authMiddleware, documentController.findAll);
router.put('/:id', authMiddleware, documentController.update);
router.delete('/:id', authMiddleware, documentController.delete);
router.patch('/:id/restore', authMiddleware, documentController.restore);

module.exports = router;