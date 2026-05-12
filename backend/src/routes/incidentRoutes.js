const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, incidentController.create);
router.get('/', authMiddleware, incidentController.findAll);
router.get('/:id', authMiddleware, incidentController.findOne);
router.put('/:id', authMiddleware, incidentController.update);
router.delete('/:id', authMiddleware, incidentController.delete);
router.patch('/:id/restore', authMiddleware, incidentController.restore);

module.exports = router;