const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// A lista de permissões só é usada no backoffice autenticado.
router.use(authMiddleware);

// Apenas utilizadores autorizados podem consultar a matriz de permissões.
router.get('/', checkPermission('VIEW_PERMISSIONS'), permissionController.getAll);

module.exports = router;
