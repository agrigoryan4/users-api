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

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Error:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: error name
 *        message:
 *          type: string
 *          description: error message
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: user id
 *        username:
 *          type: string
 *          description: username
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: date and time the user was created as an ISO string
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: date and time the user has been last updated as an ISO string
 */

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    tags:
 *    - users
 *    summary: Retrieve the user with the given id
 *    description: Retrieve a user by specifying its id as a path parameter.
 *    parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: uuid of the user
 *    responses:
 *      200:
 *        description: The data of the desired user.
 *        content:
 *          application/json:
 *            type: object
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *    - users
 *    summary: Retrieve users list
 *    description: Retrieve a users list, optionally filtered by username and pagination options.
 *    parameters:
 *    - in: query
 *      name: limit
 *      schema:
 *        type: integer
 *      required: false
 *    - in: query
 *      name: offset
 *      schema:
 *        type: integer
 *      required: false
 *    - in: query
 *      name: username
 *      schema:
 *        type: string
 *      required: false
 *      description: username filter string
 *    responses:
 *      200:
 *        description: List of retrieved users
 *        content:
 *          application/json:
 *            type: array
 *            items:
 *              type: object
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res, next) => {
  let { limit, offset } = req.query;
  const { username = '' } = req.query;
  limit = parseNumber(limit) !== null ? parseNumber(limit) : DEFAULT_LIMIT;
  offset = parseNumber(offset) !== null ? parseNumber(offset) : DEFAULT_OFFSET;
  req.query = { ...req.query, ...{ limit, offset } };
  try {
    const users = await userCtrl.getUsers({ pagination: { limit, offset }, filter: { username } });
    res.respData.data = users;
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users:
 *  post:
 *    tags:
 *    - users
 *    summary: Register a new user
 *    description: Create a new user, passing in the data.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          type: object
 *          schema:
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *              repeatPassword:
 *                type: string
 *                required: true
 *    responses:
 *      201:
 *        description: The newly created user
 *        content:
 *          application/json:
 *            type: object
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      400:
 *        description: Bad request or validation error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      409:
 *        description: Resource conflict error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /users:
 *  patch:
 *    tags:
 *    - users
 *    summary: Update the user
 *    description: Update the desired properties of a user by specifying them as key-value pairs.
 *    security:
 *    - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          type: object
 *          schema:
 *            properties:
 *              id:
 *                type: string
 *                required: true
 *              username:
 *                type: string
 *                required: false
 *    responses:
 *      200:
 *        description: Empty response indicating successful update
 *        content:
 *          application/json:
 *            type: object
 *      400:
 *        description: Bad request or validation error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      409:
 *        description: Resource conflict error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /users:
 *  delete:
 *    tags:
 *    - users
 *    summary: Delete the user
 *    description: Delete the user with its data from the database.
 *    security:
 *    - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          type: object
 *          schema:
 *            properties:
 *              id:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Empty response indicating successful deletion
 *        content:
 *          application/json:
 *            type: object
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
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
