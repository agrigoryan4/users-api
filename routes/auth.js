const express = require('express');
const { auth: authCtrl } = require('../controllers');
// exceptions
const {
  BadRequestException,
} = require('../utils/exceptions/userFacingExceptions');
const userValidation = require('../utils/validation/userValidation');
const transformJoiException = require('../utils/exceptions/transformJoiException');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new BadRequestException();
    }
    const { error } = userValidation.validate({
      username,
      password,
    });
    if (error) {
      transformJoiException(error);
    }
    const accessToken = await authCtrl.getAccessToken(username, password);
    res.respData.data = {
      accessToken,
    };
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
