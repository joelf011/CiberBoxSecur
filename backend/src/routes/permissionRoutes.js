const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Only admins
router.use(authMiddleware);

router.get('/', permissionController.getAll);
router.post('/', permissionController.create);
router.put('/:id', permissionController.update);
router.delete('/:id', permissionController.delete);

module.exports = router;