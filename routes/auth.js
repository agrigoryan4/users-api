const express = require('express');
const { auth: authCtrl } = require('../controllers');
// exceptions
const {
  BadRequestException,
} = require('../utils/exceptions/userFacingExceptions');
const userValidation = require('../utils/validation/userValidation');
const transformJoiException = require('../utils/exceptions/transformJoiException');

const router = express.Router();
/**
 * @swagger
 * /auth:
 *  post:
 *    tags:
 *    - auth
 *    summary: Authenticate
 *    description: Authenticate with username and password and get a JWT token.
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
 *    responses:
 *      200:
 *        description: JWT token with an expiration time of 30 minutes
 *        content:
 *          application/json:
 *            type: object
 *            schema:
 *              properties:
 *                accessToken:
 *                  type: string
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */

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
