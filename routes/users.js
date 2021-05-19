const express = require('express');
const userCtrl = require('../controllers/users');
const { HttpBadRequestException } = require('../exceptions/httpExceptions');

const router = express.Router();

router.get('/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw new HttpBadRequestException();
        }
        const user = userCtrl.getUser(id);
        res.respData.data = user;
        next();
    } catch (error) {
        next(error);
    }
});
router.get('/', (req, res, next) => {
    try {
        const users = userCtrl.getUsers();
        res.respData.data = users;
        next();
    } catch (error) {
        next(error);
    }
});
router.post('/', (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            throw new HttpBadRequestException();
        }
        const newUser = userCtrl.addUser(username, password);
        res.respData.data = newUser;
        res.status(201);
        next()
    } catch (error) {
        next(error);
    }
});
router.patch('/', (req, res, next) => {
    try {
        const { id, username, password } = req.body;
        if(!id) throw new HttpBadRequestException();
        const editedUser = userCtrl.editUser(id, username, password);
        res.respData.data = editedUser;
        next();
    } catch (error) {
        next(error);
    }
});
router.delete('/', (req, res, next) => {
    try {
        const { id } = req.body;
        if(!id) throw new HttpBadRequestException();
        userCtrl.deleteUser(id);
        res.status(202);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
