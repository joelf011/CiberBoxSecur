const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Public route
router.get('/', categoryController.getAll);

// Private route (only authenticated users)
router.post('/', authMiddleware, checkPermission('CREATE_CATEGORY'), categoryController.create);
router.put('/:id', authMiddleware, checkPermission('UPDATE_CATEGORY'), categoryController.update);
router.delete('/:id', authMiddleware, checkPermission('DELETE_CATEGORY'), categoryController.delete);

module.exports = router;