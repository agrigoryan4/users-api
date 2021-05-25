const { sequelize } = require('../models/database');
const bcrypt = require('bcrypt');
// exceptions
const transformSequelizeException = require('../utils/exceptions/transformSequelizeException');
const {
    NotFoundException
} = require('../utils/exceptions/UserFacingExceptions');

class Service {
    static async createUser(username, password) {
        const encryptedPassword = await bcrypt.hash(password, 12);
        const user = User.build({
            username, 
            password: encryptedPassword
        });
        try {
            await user.save({
                returning: false
            });
            const newUser = await User.findOne({
                where: {
                    username: username
                },
                attributes: {
                    exclude: ['password']
                }
            });
            return newUser;
        } catch (error) {
            transformSequelizeException(error, 'Unable to create user');
        }
    }
    static async getAllUsers() {
        let users = await User
            .findAll({
                attributes: { exclude: ['password'] }
            });
        users = users.map(user => user.dataValues);
        return users;
    }
    static async getUserPassword(id, username) {
        let where = {};
        if(id) {
            where.id = id;
        } else if(username) {
            where.username = username;
        } else {
            return null
        };
        const user = await User
            .findOne({
                attributes: ['password'],
                where: where
            });
        const hashedPassword = user.dataValues.password ? user.dataValues.password : null;
        return hashedPassword;
    }
    static async getUserByUsername(username) {
        const user = await User
            .findOne({ 
                attributes: { exclude: ['password'] }, 
                where: { username: username } 
            });
        return user?.dataValues ? user.dataValues : null;
    }
    static async getUserById(id) {
        const user = await User
            .findOne({
                attributes: { exclude: ['password'] }, 
                where: { id: id } 
            });
        return user?.dataValues ? user.dataValues : null;
    }
    static async deleteUserById(id) {
        try {
            const result = await User.destroy({ where: { id: id } });
            if(!result) {
                throw new NotFoundException('Unable to delete user. Id not found.');
            }
        } catch (error) {
            transformSequelizeException(error);
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
        try {
            const result = await User.update(
                updateObject, 
                {
                    returning: false,
                    where: { id: id }
                }
            );
            if(result[0] === 0) {
                throw new NotFoundException('Unable to edit user with the given id.');
            }
            const user = await User.findOne({ 
                attributes: { exclude: ['password'] }, 
                where: { id: id } 
            });
            const { dataValues: updatedUser } = user;
            return updatedUser;
        } catch (error) {
            transformSequelizeException(error, 'Unable to edit user');
        }
    }
}

module.exports = Service;
