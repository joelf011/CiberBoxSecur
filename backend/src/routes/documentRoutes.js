const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Require authentication
router.use(authMiddleware);

// File Upload (Auth -> Permission -> Upload -> Controller)
router.post('/', checkPermission('CREATE_DOCUMENT'), upload.single('file'), documentController.create);

router.get('/', checkPermission('VIEW_DOCUMENTS'), documentController.findAll);
router.put('/:id', checkPermission('UPDATE_DOCUMENT'), documentController.update);
router.delete('/:id', checkPermission('DELETE_DOCUMENT'), documentController.delete);
router.patch('/:id/restore', checkPermission('RESTORE_DOCUMENT'), documentController.restore);

module.exports = router;