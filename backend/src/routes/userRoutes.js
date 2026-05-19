const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Require authentication
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// ADMIN routes
router.get('/', checkPermission('VIEW_USERS'), userController.getAllAdmin);
router.put('/:id', checkPermission('UPDATE_USER'), userController.updateAdmin);
router.delete('/:id', checkPermission('DELETE_USER'), userController.delete);

module.exports = router;