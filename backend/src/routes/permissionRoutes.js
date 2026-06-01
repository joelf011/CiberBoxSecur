const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Require authentication
router.use(authMiddleware);

// Specific permissions
router.get('/', checkPermission('VIEW_PERMISSIONS'), permissionController.getAll);

module.exports = router;