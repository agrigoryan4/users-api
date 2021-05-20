const User = require('../models/user');
const bcrypt = require('bcrypt');
const { UserNotFoundException } = require('../exceptions/userExceptions');

class Service {
    static async createUser(username, password) {
        const encryptedPassword = await bcrypt.hash(password, 12);
        const user = User.build({
            username, 
            password: encryptedPassword
        });
        const { dataValues: newUser } = await user.save();
        return newUser;
    }
    static async getAllUsers() {
        let users = await User.findAll();
        users = users.map(user => user.dataValues);
        return users;
    }
    static async getUserById(id) {
        const user = await User.findOne({ where: { id: id } });
        return user?.dataValues ? user.dataValues : null;
    }
    static async deleteUserById(id) {
        const result = await User.destroy({ where: { id: id } });
        if(!result) {
            throw new UserNotFoundException();
        }
    }
    static async updateUser(id, username, password) {
        const updateObject = {};
        if(username) {
            updateObject.username = username;
        }
        if(password) {
            const newEncryptedPassword = await bcrypt.hash(password, 12);
            updateObject.password = newEncryptedPassword;
        }
        const result = await User.update(
            updateObject, 
            { 
                returning: true, 
                where: { id: id }
            }
        );
        if(result[0] === 0) {
            throw new UserNotFoundException();
        }
        const { dataValues: updatedUser } = result[1][0];
        return updatedUser;
    }
}

class Helpers {
    static async doesUserExist(queryObject) {
        const count = await User.count({ where: queryObject });
        return count > 0 ? true : false;
    }
}

module.exports.Service = Service;
module.exports.Helpers = Helpers;
