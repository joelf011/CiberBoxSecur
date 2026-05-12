const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, companyController.create);
router.get('/', authMiddleware, companyController.findAll);
router.get('/:id', authMiddleware, companyController.findOne);
router.put('/:id', authMiddleware, companyController.update);
router.delete('/:id', authMiddleware, companyController.delete);
router.patch('/:id/restore', authMiddleware, companyController.restore);

module.exports = router;