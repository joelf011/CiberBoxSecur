const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleController.create);
router.get('/', authMiddleware, roleController.findAll);
router.get('/:id', authMiddleware, roleController.findOne);
router.put('/:id', authMiddleware, roleController.update);
router.delete('/:id', authMiddleware, roleController.delete);
router.patch('/:id/restore', authMiddleware, roleController.restore);

module.exports = router;