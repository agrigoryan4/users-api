const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { sequelize: { models: { User } } } = require('../models');
// exceptions
const transformSequelizeException = require('../utils/exceptions/transformSequelizeException');
const {
  NotFoundException,
} = require('../utils/exceptions/userFacingExceptions');
// constants
const { DEFAULT_LIMIT, DEFAULT_OFFSET } = require('../utils/constants/pagination');

class Service {
  /**
   * creates a new user with the given data and saves in the database
   * @param {Object} data
   * @returns {Promise<Model<any, TModelAttributes>>}
   */
  static async createUser({ username, password }) {
    const encryptedPassword = await bcrypt.hash(password, 12);
    const user = User.build({
      username,
      password: encryptedPassword,
    });
    let newUser;
    try {
      await user.save({
        returning: false,
      });
      newUser = await User.findOne({
        where: {
          username,
        },
        attributes: {
          exclude: ['password'],
        },
      });
    } catch (error) {
      transformSequelizeException(error, 'Unable to create user');
    }
    return newUser;
  }

  /**
   * returns all users from the database that satisfy the pagination and filter options provided
   * @param {Object} pagination
   * @param {Object} filter
   * @returns {Promise<{count, rows: *}>}
   */
  static async getAllUsers({
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
  }, { username }) {
    const result = await User.findAndCountAll({
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
      },
      offset,
      limit,
    });
    const { count, rows } = result;
    return {
      count,
      rows,
    };
  }

  /**
   * returns the password of the given user provided an id or a username
   * @param {string} id
   * @param {string} username
   * @returns {Promise<null|*>}
   */
  static async getUserPassword(id, username) {
    const where = {};
    if (id) {
      where.id = id;
    } else if (username) {
      where.username = username;
    } else {
      return null;
    }

    const user = await User
      .findOne({
        attributes: ['password'],
        where,
      });
    const hashedPassword = user?.password || null;
    return hashedPassword;
  }

  /**
   * returns the user given its username
   * @param {string} username
   * @returns {Promise<Model<any, TModelAttributes>|null>}
   */
  static async getUserByUsername(username) {
    const user = await User
      .findOne({
        attributes: { exclude: ['password'] },
        where: { username },
      });
    return user || null;
  }

  /**
   * returns the user given its id
   * @param {string} id
   * @returns {Promise<Model<any, TModelAttributes>|null>}
   */
  static async getUserById(id) {
    const user = await User
      .findOne({
        attributes: { exclude: ['password'] },
        where: { id },
      });
    return user || null;
  }

  /**
   * deletes the user from the database given its id
   * @param {string} id
   * @returns {Promise<number>}
   */
  static async deleteUserById(id) {
    let result;
    try {
      result = await User.destroy({ where: { id } });
      if (!result) {
        throw new NotFoundException('Unable to delete user. Id not found.');
      }
    } catch (error) {
      transformSequelizeException(error);
    }
    return result;
  }

  /**
   * updates the user provided its id, and an update options object,
   * where update attributes are specified
   * @param {string} id
   * @param {Object} updateOptions
   * @returns {Promise<[number, Model[]]>}
   */
  static async updateUser(id, updateOptions) {
    let result;
    try {
      result = await User.update(
        updateOptions,
        {
          returning: false,
          where: { id },
        },
      );
      if (result[0] === 0) {
        throw new NotFoundException('Unable to edit user with the given id.');
      }
    } catch (error) {
      transformSequelizeException(error, 'Unable to edit user');
    }
    return result;
  }
}

module.exports = Service;
