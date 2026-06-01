const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companiesController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Require authentication for ALL company routes
router.use(authMiddleware);

// Specific permissions for each action
router.post('/', checkPermission('CREATE_COMPANY'), companyController.create);
router.get('/', checkPermission('VIEW_COMPANIES'), companyController.findAll);
router.get('/:id', checkPermission('VIEW_COMPANIES'), companyController.findOne);
router.put('/:id', checkPermission('UPDATE_COMPANY'), companyController.update);
router.delete('/:id', checkPermission('DELETE_COMPANY'), companyController.delete);
router.patch('/:id/restore', checkPermission('RESTORE_COMPANY'), companyController.restore);

module.exports = router;