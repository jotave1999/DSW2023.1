const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const { getAll, getById, addNew, updateUser: updateItem, removeUser: removeItem, passRecover, requestPassRecover, changePass } = require('./user.controller');
const router = express.Router();

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', addNew)
router.put('/:id', updateItem)
router.delete('/:id', removeItem)
router.post('/recover/request', requestPassRecover)
router.post('/recover', passRecover)
router.post('/pass/change', changePass)

module.exports = router;

