const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Todas as rotas de utilizador exigem token válido para preencher req.user.
router.use(authMiddleware);

// Perfil próprio: sessão autenticada é suficiente.
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Gestão administrativa protegida por permissões granulares.
router.get('/', checkPermission('VIEW_USERS'), userController.getAllAdmin);
router.put('/:id', checkPermission('UPDATE_USER'), userController.updateAdmin);
router.delete('/:id', checkPermission('DELETE_USER'), userController.delete);

module.exports = router;
