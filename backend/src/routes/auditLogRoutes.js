/**
 * Rotas de Registos de Auditoria (Audit Logs).
 *
 * Responsável por:
 * - Disponibilizar os registos de auditoria para consulta no backoffice.
 *
 * Apenas utilizadores autenticados com permissão VIEW_AUDIT_LOGS podem aceder.
 */
const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Aplica autenticação obrigatória a todas as rotas deste módulo.
router.use(authMiddleware);

// Lista os registos de auditoria com filtros (ação, data, pesquisa, empresa) e paginação.
router.get('/', checkPermission('VIEW_AUDIT_LOGS'), auditLogController.getLogs);

module.exports = router;