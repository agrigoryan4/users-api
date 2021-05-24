const User = require('../models/user');
const { Service, Helpers } = require('../services/users');
const { BaseError: SequelizeError } = require('sequelize').Sequelize;
const {
    Exception
} = require('../exceptions/Exception');
const { 
    UserValidationException,
    UserAlreadyExistsException, 
    UserNotFoundException 
} = require('../exceptions/userExceptions');
const {
    DatabaseException
} = require('../exceptions/databaseExceptions');

class UsersController {
    static async addUser(username, password) {
        const userExists = await Helpers.doesUserExist({ username: username });
        if(userExists) {
            throw new UserAlreadyExistsException();
        }
        const newUser = await Service.createUser(username, password);
        return newUser;
    }
    static async getUsers() {
        const users = await Service.getAllUsers();
        return users;
    }
    static async getUser(id) {
        const user = await Service.getUserById(id);
        return user;
    }
    static async deleteUser(id) {
        try {
            const result = await Service.deleteUserById(id);
        } catch (error) {
            if(error instanceof SequelizeError) {
                throw new UserException.getUserException(new DatabaseException(error));
            } else {
                throw error;
            };
        }
    }
    static async editUser(id, username, password) {
        const userExists = await Helpers.doesUserExist({ username: username });
        if(userExists) {
            throw new UserAlreadyExistsException();
        }
        try {
            const updatedUser = Service.updateUser(id, username, password);
            return updatedUser;
        } catch (error) {
            if(error instanceof SequelizeError) {
                throw new UserException.getUserException(new DatabaseException(error));
            } else {
                throw error;
            };
        }
    }
}

class UserException {
    static getUserException(dbError) {
        const { message, statusCode } = dbError;
        if(statusCode === 'VALIDATION_ERROR') {
            const exception = new UserValidationException();
            exception.message = message;
            exception.statusCode = statusCode;
            return exception;
        }
        else {
            const exception = new Exception(message, statusCode, 500);
            return exception;
        }
    }
}

module.exports = UsersController;
