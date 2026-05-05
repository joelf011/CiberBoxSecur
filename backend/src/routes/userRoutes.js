const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Profile route
router.get('/me', authMiddleware, userController.getProfile);

module.exports = router;