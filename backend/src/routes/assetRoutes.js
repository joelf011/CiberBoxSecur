const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, assetController.create);
router.get('/', authMiddleware, assetController.findAll);
router.get('/:id', authMiddleware, assetController.findOne);
router.put('/:id', authMiddleware, assetController.update);
router.delete('/:id', authMiddleware, assetController.delete);
router.patch('/:id/restore', authMiddleware, assetController.restore);

module.exports = router;