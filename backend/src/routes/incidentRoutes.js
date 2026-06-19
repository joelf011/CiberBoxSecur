const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Incidentes exigem sessão para o service aplicar o âmbito da empresa.
router.use(authMiddleware);

// Permissões granulares protegem cada operação de incidente.
router.post('/', checkPermission('CREATE_INCIDENT'), incidentController.create);
router.get('/', checkPermission('VIEW_INCIDENTS'), incidentController.findAll);
router.get('/:id', checkPermission('VIEW_INCIDENTS'), incidentController.findOne);
router.put('/:id', checkPermission('UPDATE_INCIDENT'), incidentController.update);
router.delete('/:id', checkPermission('DELETE_INCIDENT'), incidentController.delete);
router.patch('/:id/restore', checkPermission('RESTORE_INCIDENT'), incidentController.restore);

module.exports = router;
