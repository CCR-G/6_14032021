const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesController = require('../controllers/sauce');

router.post('/', auth, multer, saucesController.create);
router.get('/:id', auth, saucesController.getOne);
router.put('/:id', auth, multer, saucesController.modify);
router.delete('/:id', auth, saucesController.delete);
router.post('/:id/like', auth, saucesController.like);
router.get('/', auth, saucesController.getAll);

module.exports = router;