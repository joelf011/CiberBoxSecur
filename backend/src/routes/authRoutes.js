const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const loginRateLimiter = require('../middlewares/rateLimiter');

// Regist
router.post('/register', authMiddleware, checkPermission('CREATE_USER'), authController.register);
router.post('/resend-activation', authMiddleware, checkPermission('CREATE_USER'), authController.resendActivation);

// Login route
router.post('/login', loginRateLimiter, authController.login);

// Activation route
router.post('/activate', authController.activateAccount);

// Forgot pw route
router.post('/forgot-password', authController.forgotPassword);

// Reset pw route
router.post('/reset-password', authController.resetPassword);

module.exports = router;