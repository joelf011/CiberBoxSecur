/**
 * Rotas de Categorias de Artigos.
 *
 * Responsável por:
 * - Listar categorias publicamente (para filtros no blog).
 * - Gerir categorias no backoffice (criar, editar, eliminar).
 *
 * Categorias são associadas a artigos via tabela intermédia (relação N:N).
 */
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// --- ROTA PÚBLICA ---

// Lista todas as categorias disponíveis (usado no frontend para filtros de artigos).
router.get('/', categoryController.getAll);

// --- ROTAS PROTEGIDAS (gestão de categorias no backoffice) ---

// Cria uma nova categoria de artigos.
router.post('/', authMiddleware, checkPermission('CREATE_CATEGORY'), categoryController.create);

// Atualiza o nome/slug de uma categoria existente.
router.put('/:id', authMiddleware, checkPermission('UPDATE_CATEGORY'), categoryController.update);

// Remove uma categoria. Os artigos associados perdem esta categoria.
router.delete('/:id', authMiddleware, checkPermission('DELETE_CATEGORY'), categoryController.delete);

module.exports = router;