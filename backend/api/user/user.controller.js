const userService = require('./user.service.js');
const logger = require('../../service/logger.service');

// GET LIST
async function query(req, res) {
    try {
        var params = req.query;
        const send = await userService.query(params);
        res.json(send);
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

// GET BY ID 
async function get(req, res) {
    try {
        const { id } = req.params;
        res.json(await userService.get({ _id: id }));
    } catch (err) {
        logger.error('Failed to get user', err);
        res.status(500).send({ err: 'Failed to get user' });
    }
}

// POST
async function add(req, res) {
    try {
        const user = req.body;
        res.json(await userService.add(user));
    } catch (err) {
        logger.error('Failed to add user', err);
        res.status(500).send({ err: 'Failed to add user' });
    }
}

// PUT
async function update(req, res) {
    try {
        const user = req.body;
        const savedUser = await userService.update(user);
        // res.json(ret);
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err);
        res.status(500).send({ err: 'Failed to update user' });

    }
}

// DELETE
async function remove(req, res) {
    try {
        const { id } = req.params;
        res.send(await userService.remove(id));
    } catch (err) {
        logger.error('Failed to remove user', err);
        res.status(500).send({ err: 'Failed to remove user' });
    }
}

async function requestPassRecover(req, res) {
    try {
        const {email} = req.body;
        res.json(await userService.requestPassRecover(email));
    } catch (err) {
        logger.error('Failed to request password recover to user', err);
        res.status(500).send({ err: 'Failed to request password recover to user' });
    }
}

async function recoverPass(req, res) {
    try {
        const {recoverString, password} = req.body;
        res.json(await userService.recoverPass(recoverString, password));
    } catch (err) {
        logger.error('Failed to password recover to user', err);
        res.status(500).send({ err: 'Failed to password recover to user' });
    }
}

async function changePass(req, res) {
    try {
        const {user} = req.session;
        const {password} = req.body;
        res.json(await userService.changePass(user,password));
    } catch (err) {
        logger.error('Failed to change user password', err);
        res.status(500).send({ err: 'Failed to change user password' });
    }
}

module.exports = {
    getAll: query,
    getById: get,
    addNew: add,
    updateUser: update,
    removeUser: remove,
    requestPassRecover,
    changePass,
    recoverPass
    
}
