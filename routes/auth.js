const express = require('express');
const { auth: authCtrl } = require('../controllers');
// exceptions
const { 
    BadRequestException, ValidationException
} = require('../utils/exceptions/UserFacingExceptions');
const userValidation = require('../utils/validation/userValidation');
// middleware
const auth = require('../middleware/auth');


const router = express.Router();

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if(!username || !password) {
            throw new BadRequestException();
        }
        const { error, value } = userValidation.validate({
            username: username,
            password: password
        });
        if(error) {
            throw new ValidationException();
        }
        const accessToken = await authCtrl.getAccessToken(username, password);
        res.respData.data = {
            accessToken: accessToken
        };
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
