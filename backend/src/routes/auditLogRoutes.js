const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../middlewares/authMiddleware');

// Only authenticated users
router.get('/', authMiddleware, auditLogController.getLogs);

module.exports = router;