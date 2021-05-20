const User = require('../models/user');
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
        if(await User.count({ where: { username: username } })) {
            throw new UserAlreadyExistsException();
        }
        const user = User.build({
            username, 
            password 
        });
        const { dataValues: newUser } = await user.save();
        return newUser;
    }
    static async getUsers() {
        let users = await User.findAll();
        users = users.map(user => user.dataValues);
        return users;
    }
    static async getUser(id) {
        const user = await User.findOne({ where: { id: id } });
        if(!user) {
            throw new UserNotFoundException();
        }
        return user;
    }
    static async deleteUser(id) {
        try {
            const result = await User.destroy({ where: { id: id } });
            if(!result) {
                throw new UserNotFoundException();
            }
        } catch (error) {
            throw new UserException.getUserException(new DatabaseException(error));
        }
    }
    static async editUser(id, username, password) {
        if(await User.count({ where: { username: username } })) {
            throw new UserAlreadyExistsException();
        }
        try {
            const updateObject = {};
            if(username) {
                updateObject.username = username;
            }
            if(password) {
                updateObject.password = password;
            }
            const result = await User.update(
                updateObject, 
                { 
                    returning: true, 
                    where: { id: id }
                }
            );
            const { dataValues: updatedUser } = result[1][0];
            return updatedUser;
        } catch (error) {
            throw new UserError.getUserException(new DatabaseException(error));
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
