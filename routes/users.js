const express = require('express');
const auth = require('../middleware/auth');
const { users: userCtrl } = require('../controllers');
const userValidation = require('../utils/validation/userValidation');
const transformJoiException = require('../utils/exceptions/transformJoiException');
const { 
    BadRequestException,
    ForbidenException
} = require('../utils/exceptions/UserFacingExceptions');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw new BadRequestException();
        }
        const { error, value } = userValidation.validate({ 
            id: id
        });
        if(error) {
            transformJoiException(error, 'Unable to get user');
        }
        const user = await userCtrl.getUser(id);
        res.respData.data = user;
        next();
    } catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const users = await userCtrl.getUsers();
        res.respData.data = users;
        next();
    } catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const { username, password, repeatPassword } = req.body;
        if(!username || !password) {
            throw new BadRequestException();
        }
        const { error, value } = userValidation.validate({ 
            username: username,
            password: password,
            repeatPassword: repeatPassword 
        });
        if(error) {
            transformJoiException(error, 'Unable to create user');
        }
        const newUser = await userCtrl.addUser(username, password);
        res.respData.data = newUser;
        res.status(201);
        next()
    } catch (error) {
        next(error);
    }
});
router.patch('/', auth, async (req, res, next) => {
    try {
        const { id, username, password } = req.body;
        if(!id) {
            throw new BadRequestException();
        }
        if(req.user.id !== id) {
            throw new ForbidenException();
        }
        const { error, value } = userValidation.validate({
            id: id,
            username: username,
            password: password
        });
        if(error) {
            transformJoiException(error, 'Unable to edit user');;
        }
        const editedUser = await userCtrl.editUser(id, username, password);
        res.respData.data = editedUser;
        next();
    } catch (error) {
        next(error);
    }
});
router.delete('/', auth, async (req, res, next) => {
    try {
        const { id } = req.body;
        if(!id) {
            throw new BadRequestException();
        }
        if(req.user.id !== id) {
            throw new ForbidenException();
        }
        const { error, value } = userValidation.validate({ 
            id: id
        });
        if(error) {
            transformJoiException(error, 'Unable to delete user');
        }
        await userCtrl.deleteUser(id);
        res.status(202);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
