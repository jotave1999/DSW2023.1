const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const { getAll, getById, addNew, updateUser: updateItem, removeUser: removeItem } = require('./user.controller');
const router = express.Router();

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', addNew)
router.put('/:id', updateItem)
router.delete('/:id', removeItem)

module.exports = router;

