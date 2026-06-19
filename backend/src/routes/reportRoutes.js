const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 
const checkPermission = require('../middlewares/permissionMiddleware');

// Relatórios exigem sessão antes de permissões e upload de ficheiros.
router.use(authMiddleware);

// Leitura de relatórios; o controller filtra por empresa quando aplicável.
router.get('/', checkPermission('VIEW_REPORTS'), reportController.getAll);
router.get('/:id', checkPermission('VIEW_REPORTS'), reportController.getOne);

// Escrita com ficheiro: autorização primeiro, Multer depois, controller no fim.
router.post('/', checkPermission('CREATE_REPORT'), upload.single('file'), reportController.create);
router.put('/:id', checkPermission('UPDATE_REPORT'), upload.single('file'), reportController.update);

// Eliminação lógica controlada por permissão específica.
router.delete('/:id', checkPermission('DELETE_REPORT'), reportController.delete);

module.exports = router;
