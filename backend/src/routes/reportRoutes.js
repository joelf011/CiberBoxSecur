const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 
const checkPermission = require('../middlewares/permissionMiddleware');

router.use(authMiddleware);

// READ
router.get('/', checkPermission('VIEW_REPORTS'), reportController.getAll);
router.get('/:id', checkPermission('VIEW_REPORTS'), reportController.getOne);

// CREATE/UPDATE routes
router.post('/', checkPermission('CREATE_REPORT'), upload.single('file'), reportController.create);
router.put('/:id', checkPermission('UPDATE_REPORT'), upload.single('file'), reportController.update);

// DELETE
router.delete('/:id', checkPermission('DELETE_REPORT'), reportController.delete);

module.exports = router;