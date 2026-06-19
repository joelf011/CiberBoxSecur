const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Documentos exigem autenticação antes de qualquer permissão ou upload.
router.use(authMiddleware);

// Upload de ficheiro: sessão -> permissão -> Multer -> controller.
router.post('/', checkPermission('CREATE_DOCUMENT'), upload.single('file'), documentController.create);

router.get('/', checkPermission('VIEW_DOCUMENTS'), documentController.findAll);
router.put('/:id', checkPermission('UPDATE_DOCUMENT'), documentController.update);
router.delete('/:id', checkPermission('DELETE_DOCUMENT'), documentController.delete);
router.patch('/:id/restore', checkPermission('RESTORE_DOCUMENT'), documentController.restore);

module.exports = router;
