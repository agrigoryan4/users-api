const bcrypt = require('bcrypt')
const { sequelize } = require('../models');
const { sequelize: { models: { User } } } = require('../models');
// exceptions
const transformSequelizeException = require('../utils/exceptions/transformSequelizeException');
const {
  NotFoundException,
} = require('../utils/exceptions/userFacingExceptions');

class Service {
  static async createUser({ username, password }) {
    const encryptedPassword = await bcrypt.hash(password, 12);
    const user = User.build({
      username,
      password: encryptedPassword,
    });
    try {
      await user.save({
        returning: false,
      });
      const newUser = await User.findOne({
        where: {
          username,
        },
        attributes: {
          exclude: ['password'],
        },
      });
      return newUser;
    } catch (error) {
      transformSequelizeException(error, 'Unable to create user');
    }
  }

  static async getAllUsers({ limit, offset }, { username }) {
    console.log(`
    SELECT "id", "username", "createdAt", "updatedAt"
      FROM "Users"
      ${ username ? `WHERE "username" LIKE '%${username}%'` : '' }
      ORDER BY "username" ASC
      ${ limit !== null && offset !== null ? (
        `LIMIT ${limit} OFFSET ${offset}`
    ) : '' }
    `)
    let [ users ] = await sequelize.query(`
      SELECT "id", "username", "createdAt", "updatedAt"
      FROM "Users"
      ${ username ? `WHERE "username" LIKE '%${username}%'` : '' }
      ORDER BY "username" ASC
      ${ limit !== null && offset !== null ? (
          `LIMIT ${limit} OFFSET ${offset}`
      ) : '' }
    `);
    let [ usersCount ] = await sequelize.query(`
      SELECT COUNT("id")
      FROM "Users"
      ${ username ? `WHERE "username" LIKE '%${username}%'` : '' }
    `);
    return {
      rows: users,
      count: usersCount[0].count
    };
  }

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

  static async getUserByUsername(username) {
    const user = await User
      .findOne({
        attributes: { exclude: ['password'] },
        where: { username },
      });
    return user || null;
  }

  static async getUserById(id) {
    const user = await User
      .findOne({
        attributes: { exclude: ['password'] },
        where: { id },
      });
    return user || null;
  }

  static async deleteUserById(id) {
    try {
      const result = await User.destroy({ where: { id } });
      if (!result) {
        throw new NotFoundException('Unable to delete user. Id not found.');
      }
      return result;
    } catch (error) {
      transformSequelizeException(error);
    }
  }

  static async updateUser(id, { username }) {
    const updateObject = {};
    if (username) {
      updateObject.username = username;
    }
    try {
      const result = await User.update(
        updateObject,
        {
          returning: false,
          where: { id },
        },
      );
      if (result[0] === 0) {
        throw new NotFoundException('Unable to edit user with the given id.');
      }
      return result;
    } catch (error) {
      transformSequelizeException(error, 'Unable to edit user');
    }
  }
}

module.exports = Service;
