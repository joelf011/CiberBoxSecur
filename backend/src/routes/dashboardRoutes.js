const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// O dashboard depende de req.user para filtrar dados por empresa e permissões.
router.get('/', authMiddleware, dashboardController.getDashboardData);

module.exports = router;
