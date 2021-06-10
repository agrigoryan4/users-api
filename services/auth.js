const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  UnauthorizedException,
} = require('../utils/exceptions/userFacingExceptions');
const UsersService = require('./users');

class Service {
  /**
   * returns an authorization token
   * provided a valid username and password combination
   * @param {string} username
   * @param {string} password
   * @returns {Promise<*>}
   */
  static async login({ username, password }) {
    const user = await Service.authenticate({ username, password });
    const token = await Service.generateTokenById(user.id);
    return token;
  }

  /**
   * returns the user given a valid username and password combination
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Model<*, TModelAttributes>>}
   */
  static async authenticate({ username, password }) {
    const user = await UsersService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const userHashedPassword = await UsersService.getUserPassword(null, username);
    if (!userHashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, userHashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * returns a jwt token where the payload contains the id specified as an argument
   * the expiration of the token is 30 minutes
   * @param {string} id
   * @returns {Promise<*>}
   */
  static async generateTokenById(id) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const expirationTime = now.toISOString();
    const tokenPayload = {
      id,
      expires: expirationTime,
    };
    const accessToken = await jwt.sign(
      tokenPayload,
      process.env.JWT_ACCESS_SECRET,
    );
    return accessToken;
  }
}

module.exports = Service;
