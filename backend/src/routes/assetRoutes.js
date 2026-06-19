/**
 * Rotas de Ativos (Assets).
 *
 * Responsável por:
 * - CRUD completo de ativos de infraestrutura/segurança.
 * - Restauro de ativos eliminados por soft-delete.
 *
 * Todas as rotas exigem autenticação (authMiddleware aplicado globalmente).
 * Cada operação exige uma permissão específica verificada pelo permissionMiddleware.
 */
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Aplica autenticação obrigatória a todas as rotas deste módulo.
router.use(authMiddleware);

// Cria um novo ativo associado a uma empresa.
router.post('/', checkPermission('CREATE_ASSET'), assetController.create);

// Lista todos os ativos com filtros e paginação.
router.get('/', checkPermission('VIEW_ASSETS'), assetController.findAll);

// Obtém os detalhes de um ativo específico pelo ID.
router.get('/:id', checkPermission('VIEW_ASSETS'), assetController.findOne);

// Atualiza os dados de um ativo existente.
router.put('/:id', checkPermission('UPDATE_ASSET'), assetController.update);

// Elimina um ativo (soft-delete via Sequelize paranoid).
router.delete('/:id', checkPermission('DELETE_ASSET'), assetController.delete);

// Restaura um ativo previamente eliminado por soft-delete.
router.patch('/:id/restore', checkPermission('RESTORE_ASSET'), assetController.restore);

module.exports = router;