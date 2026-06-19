/**
 * Rotas de Empresas (Companies).
 *
 * Responsável por:
 * - CRUD completo de empresas clientes da plataforma.
 * - Restauro de empresas eliminadas por soft-delete.
 *
 * Todas as rotas exigem autenticação (authMiddleware aplicado globalmente).
 * Cada operação exige uma permissão específica verificada pelo permissionMiddleware.
 */
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companiesController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Aplica autenticação obrigatória a todas as rotas deste módulo.
router.use(authMiddleware);

// Cria uma nova empresa e associa administradores responsáveis.
router.post('/', checkPermission('CREATE_COMPANY'), companyController.create);

// Lista todas as empresas com dados do proprietário e administradores associados.
router.get('/', checkPermission('VIEW_COMPANIES'), companyController.findAll);

// Obtém os detalhes completos de uma empresa específica pelo ID.
router.get('/:id', checkPermission('VIEW_COMPANIES'), companyController.findOne);

// Atualiza os dados de uma empresa e os seus administradores associados.
router.put('/:id', checkPermission('UPDATE_COMPANY'), companyController.update);

// Elimina uma empresa (soft-delete via Sequelize paranoid).
router.delete('/:id', checkPermission('DELETE_COMPANY'), companyController.delete);

// Restaura uma empresa previamente eliminada por soft-delete.
router.patch('/:id/restore', checkPermission('RESTORE_COMPANY'), companyController.restore);

module.exports = router;