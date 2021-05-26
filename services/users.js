const { sequelize } = require('../models/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
// exceptions
const transformSequelizeException = require('../utils/exceptions/transformSequelizeException');
const {
    NotFoundException, BadRequestException
} = require('../utils/exceptions/UserFacingExceptions');

class Service {
    static async createUser(username, password) {
        const returningColumns = ['id', 'username', 'createdAt', 'updatedAt'];
        let insertColumns;
        let insertValues;
        const encryptedPassword = await bcrypt.hash(password, 12);
        const id = uuidv4();
        const createdAt = (new Date()).toISOString();
        const updatedAt = createdAt;
        insertColumns = ['id', 'username', 'password', 'createdAt', 'updatedAt'];
        insertValues = [id, username, encryptedPassword, createdAt, updatedAt];
        try {
            const [ results, metadata ] = await sequelize.query(`
                INSERT INTO "Users" (${insertColumns.map(column => `"${column}"`).join(', ')})
                VALUES (${insertValues.map(val => `'${val}'`).join(', ')})
                RETURNING ${returningColumns.map(column => `"${column}"`).join(', ')}
            `);
            const user = results[0];
            return user;
        } catch (error) {
            transformSequelizeException(error, 'Unable to create user');
        }
    }
    static async getAllUsers() {
        const columns = ['id', 'username', 'createdAt', 'updatedAt'];
        const [ results, metadata ] = await sequelize.query(`
            SELECT ${columns.map(column => `"${column}"`).join(', ')} FROM "Users"
        `);
        const users = results;
        return users;
    }
    static async getUserPassword(id) {
        const [ results, metadata ] = await sequelize.query(`
            SELECT ("password") FROM "Users"
            WHERE "id" = '${id}'
        `);
        const hashedPassword = results[0].password;
        return hashedPassword;
    }
    static async getUserByUsername(username) {
        const columns = ['id', 'username', 'createdAt', 'updatedAt'];
        const [ results, metadata ] = await sequelize.query(`
            SELECT ${columns.map(column => `"${column}"`).join(', ')} FROM "Users"
            WHERE username = '${username}'
        `);
        const user = results.length !== 0 ? results[0] : null;
        return user;
    }
    static async getUserById(id) {
        const columns = ['id', 'username', 'createdAt', 'updatedAt'];
        const [ results, metadata ] = await sequelize.query(`
            SELECT ${columns.map(column => `"${column}"`).join(', ')} FROM "Users" 
            WHERE id = '${id}'
        `);
        const user = results.length !== 0 ? results[0] : null;
        return user;
    }
    static async deleteUserById(id) {
        try {
            const [ results, metadata ] = await sequelize.query(`
                DELETE FROM "Users"
                WHERE id = '${id}'
            `);
        } catch (error) {
            transformSequelizeException(error);
        }
    }
    static async updateUser(id, username, password) {
        const returningColumns = ['id', 'username', 'createdAt', 'updatedAt'];
        const columnsToUpdate = [];
        if(!username && !password) {
            throw new BadRequestException('No attributes specified to update');
        }
        if(username) {
            columnsToUpdate.push(['username', username]);
        }
        if(password) {
            const newEncryptedPassword = await bcrypt.hash(password, 12);
            columnsToUpdate.push(['password', newEncryptedPassword]);
        }
        try {
            const [ results, metadata ] = await sequelize.query(`
                UPDATE "Users"
                SET 
                    ${(() => {
                        let setStatements = '';
                        columnsToUpdate.forEach((column, index) => {
                            if(index === 0) {
                                setStatements += `"${column[0]}" = '${column[1]}'`;
                            } else {
                                setStatements += `, "${column[0]}" = '${column[1]}'`;
                            }
                        });
                        return setStatements;
                    })()}
                WHERE id = '${id}'
                RETURNING ${returningColumns.map(column => `"${column}"`).join(', ')}
            `);
            const user = results[0];
            return user;
        } catch (error) {
            transformSequelizeException(error);
        }
    }
}

module.exports = Service;
