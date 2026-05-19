const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Require authentication
router.use(authMiddleware);

// pecific permissions for assets
router.post('/', checkPermission('CREATE_ASSET'), assetController.create);
router.get('/', checkPermission('VIEW_ASSETS'), assetController.findAll);
router.get('/:id', checkPermission('VIEW_ASSETS'), assetController.findOne);
router.put('/:id', checkPermission('UPDATE_ASSET'), assetController.update);
router.delete('/:id', checkPermission('DELETE_ASSET'), assetController.delete);
router.patch('/:id/restore', checkPermission('RESTORE_ASSET'), assetController.restore);

module.exports = router;