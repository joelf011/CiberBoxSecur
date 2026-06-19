const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Todas as rotas de cargos exigem sessão válida antes da validação de permissões.
router.use(authMiddleware);

// Cada operação aplica a permissão granular antes de chegar ao controller.
router.post('/', checkPermission('CREATE_ROLE'), roleController.create);
router.get('/', checkPermission('VIEW_ROLES'), roleController.findAll);
router.get('/:id', checkPermission('VIEW_ROLES'), roleController.findOne);
router.put('/:id', checkPermission('UPDATE_ROLE'), roleController.update);
router.delete('/:id', checkPermission('DELETE_ROLE'), roleController.delete);
router.patch('/:id/restore', checkPermission('RESTORE_ROLE'), roleController.restore);

module.exports = router;
