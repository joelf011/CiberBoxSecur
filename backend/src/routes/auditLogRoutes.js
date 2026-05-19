const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Only authenticated users
router.use(authMiddleware);

router.get('/', checkPermission('VIEW_AUDIT_LOGS'), auditLogController.getLogs);

module.exports = router;