const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 

router.use(authMiddleware);

router.get('/', reportController.getAll);
router.get('/:id', reportController.getOne);

router.post('/', upload.single('file'), reportController.create);
router.put('/:id', upload.single('file'), reportController.update);

router.delete('/:id', reportController.delete);

module.exports = router;