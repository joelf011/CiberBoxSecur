const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// --- ADMIN ---
// Add here checkPermission('MANAGE_USERS'))
router.get('/', userController.getAllAdmin);
router.put('/:id', userController.updateAdmin);
router.delete('/:id', userController.delete);

module.exports = router;