const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { requirePermission, getAll, getById, addBoard, updateBoard, removeBoard, setList, setCard, setItem, removeList, removeCard, removeItem, sortBoard } = require('./board.controller');
const router = express.Router();

router.get('/', requireAuth, getAll);
router.get('/:id', requirePermission, getById);

router.post('/', requireAuth, addBoard);

router.put('/list/', requirePermission, setList);
router.put('/card/', requirePermission, setCard);
router.put('/item/', requirePermission, setItem);
router.put('/sort/:id', requirePermission, sortBoard);
router.put('/:id', requirePermission, updateBoard);

router.delete('/list', requirePermission, removeList);
router.delete('/card', requirePermission, removeCard);
router.delete('/item', requirePermission, removeItem);
router.delete('/:id', requireAuth, removeBoard);

module.exports = router;

