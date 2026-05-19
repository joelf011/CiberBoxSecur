const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Require authentication
router.use(authMiddleware);

// Specific permissions
router.get('/', checkPermission('VIEW_PERMISSIONS'), permissionController.getAll);
router.post('/', checkPermission('CREATE_PERMISSION'), permissionController.create);
router.put('/:id', checkPermission('UPDATE_PERMISSION'), permissionController.update);
router.delete('/:id', checkPermission('DELETE_PERMISSION'), permissionController.delete);

module.exports = router;