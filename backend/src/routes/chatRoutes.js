const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Auth middleware for all routes
router.use(authMiddleware);

// Global permission for the entire Chat module
// If a user doesnt have the 'USE_CHAT' permission they cant access any of the routes below
router.use(checkPermission('USE_CHAT'));

// Find or start 1-to-1 chat
router.post('/', chatController.findOrCreateChat);

// List all chats
router.get('/', chatController.getMyChats);

// Send a message
router.post('/messages', chatController.sendMessage);

// Load chat history
router.get('/:chat_id/messages', chatController.getChatMessages);

module.exports = router;