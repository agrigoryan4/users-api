const express = require('express');
// middleware
const auth = require('../middleware/auth');
// controllers
const { users: userCtrl } = require('../controllers');
// helpers
const extractExistingProperties = require('../utils/helpers/extractExistingProperties');
const parseNumber = require('../utils/helpers/parseNumber');
// constants
const { DEFAULT_LIMIT, DEFAULT_OFFSET } = require('../utils/constants/pagination');
// exceptions
const userValidation = require('../utils/validation/userValidation');
const transformJoiException = require('../utils/exceptions/transformJoiException');
const {
  BadRequestException,
  ForbiddenException,
} = require('../utils/exceptions/userFacingExceptions');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestException();
    }
    const { error } = userValidation.validate({
      id,
    });
    if (error) {
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
  let { limit, offset } = req.query;
  const { username } = req.query;
  limit = parseNumber(limit) !== null ? parseNumber(limit) : DEFAULT_LIMIT;
  offset = parseNumber(offset) !== null ? parseNumber(offset) : DEFAULT_OFFSET;
  req.query = { ...req.query, ...{ limit, offset } };
  try {
    const users = await userCtrl.getUsers({ pagination: { limit, offset }, filter: { username }});
    res.respData.data = users;
    next();
  } catch (error) {
    next(error);
  }
});
router.post('/', async (req, res, next) => {
  try {
    const { username, password, repeatPassword } = req.body;
    if (!username || !password) {
      throw new BadRequestException();
    }
    const { error } = userValidation.validate({
      username,
      password,
      repeatPassword,
    });
    if (error) {
      transformJoiException(error, 'Unable to create user');
    }
    const newUser = await userCtrl.addUser({ username, password });
    res.respData.data = newUser;
    res.status(201);
    next();
  } catch (error) {
    next(error);
  }
});
router.patch('/', auth, async (req, res, next) => {
  try {
    const { id, username } = req.body;
    if (!id) {
      throw new BadRequestException();
    }
    if (req.user.id !== id) {
      throw new ForbiddenException();
    }
    const { error } = userValidation.validate({
      id,
      username,
    });
    if (error) {
      transformJoiException(error, 'Unable to edit user');
    }
    const updateOptions = extractExistingProperties(req.body, ['username']);
    const result = await userCtrl.editUser(id, updateOptions);
    next();
  } catch (error) {
    next(error);
  }
});
router.delete('/', auth, async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      throw new BadRequestException();
    }
    if (req.user.id !== id) {
      throw new ForbiddenException();
    }
    const { error } = userValidation.validate({
      id,
    });
    if (error) {
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
