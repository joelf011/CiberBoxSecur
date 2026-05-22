const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Regist
router.post('/register', authMiddleware, checkPermission('CREATE_USER'), authController.register);
router.post('/resend-activation', authMiddleware, checkPermission('CREATE_USER'), authController.resendActivation);

// Login route
// URL: POST http://localhost:5000/api/auth/login
router.post('/login', authController.login);

// Activation route
router.post('/activate', authController.activateAccount);

module.exports = router;