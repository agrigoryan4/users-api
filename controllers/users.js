const { v4: uuidv4 } = require('uuid');
const userModel = require('../db/user.model');
const { 
    UserAlreadyExistsException, 
    UserNotFoundException 
} = require('../exceptions/userExceptions');

class UsersController {
    static addUser(username, password) {
        if(userModel.find({ username }).length > 0) {
            throw new UserAlreadyExistsException();
        }
        const user = userModel.build({ 
            id: uuidv4(), 
            username, 
            password 
        });
        const newUser = user.save();
        return newUser;
    }
    static getUsers() {
        const users = userModel.find();
        return users;
    }
    static getUser(id) {
        const user = userModel.findOne({ id: id });
        if(!user) {
            throw new UserNotFoundException();
        }
        return user;
    }
    static deleteUser(id) {
        try {
            userModel.findByIdAndDelete(id);
        } catch (error) {
            if(error.status === 404) {
                throw new UserNotFoundException();
            }
            else {
                throw error;
            };
        }
    }
    static editUser(id, username, password) {
        if(userModel.find({ username }).length !== 0) {
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
            const updatedUser = userModel.findByIdAndUpdate(id, updateObject);
            return updatedUser;
        } catch (error) {
            if(error.status === 404) {
                throw new UserNotFoundException();
            }
            else {
                throw error;
            }
        }
    }
}

module.exports = UsersController;
