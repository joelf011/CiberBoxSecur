const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// First admin regist
// URL: POST http://localhost:5000/api/auth/register
router.post('/register', authController.register);

// Login route
// URL: POST http://localhost:5000/api/auth/login
router.post('/login', authController.login);

module.exports = router;