const express = require('express');
const router = express.Router();

const saucesController = require('../controllers/sauce');

router.get('/', saucesController.getAll);
router.post('/', saucesController.create);
router.get('/:id', saucesController.getOne);
router.put('/:id', saucesController.modify);
router.delete('/:id', saucesController.delete);
router.post('/:id/like', saucesController.like);

module.exports = router;