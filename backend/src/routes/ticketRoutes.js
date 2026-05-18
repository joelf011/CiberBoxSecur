const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, ticketController.create);
router.get('/', authMiddleware, ticketController.findAll);
router.get('/:id', authMiddleware, ticketController.findOne);
router.put('/:id', authMiddleware, ticketController.update);
router.delete('/:id', authMiddleware, ticketController.delete);
router.patch('/:id/restore', authMiddleware, ticketController.restore);

module.exports = router;