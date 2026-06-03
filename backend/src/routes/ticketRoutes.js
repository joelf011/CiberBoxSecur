const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

// Require authentication
router.use(authMiddleware);

// pecific permissions
router.post('/', checkPermission('CREATE_TICKET'), ticketController.create);
router.get('/', checkPermission('VIEW_TICKETS'), ticketController.findAll);
router.get('/:id', checkPermission('VIEW_TICKETS'), ticketController.findOne);
router.get('/:id/messages', checkPermission('VIEW_TICKETS'), ticketController.getMessages);
router.put('/:id', checkPermission('UPDATE_TICKET'), ticketController.update);
router.post('/:id/claim', checkPermission('UPDATE_TICKET'), ticketController.claim);
router.delete('/:id', checkPermission('DELETE_TICKET'), ticketController.delete);
router.patch('/:id/restore', checkPermission('RESTORE_TICKET'), ticketController.restore);

module.exports = router;