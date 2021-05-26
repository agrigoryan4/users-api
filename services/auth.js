const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    UnauthorizedException
} = require('../utils/exceptions/UserFacingExceptions');
const UsersService = require('./users');

class Service {
    static async login(username, password) {
        const user = await Service.authenticate(username, password);
        const token = await Service.generateTokenById(user.id);
        return token;
    }
    static async authenticate(username, password) {
        const user = await UsersService.getUserByUsername(username);
        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const userHashedPassword = await UsersService.getUserPassword(user.id);
        if(!userHashedPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, userHashedPassword);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    static async generateTokenById(id) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        const expirationTime = now.toISOString();
        const tokenPayload = {
            id: id,
            expires: expirationTime
        };
        const accessToken = await jwt.sign(
            tokenPayload, 
            process.env.JWT_ACCESS_SECRET
        );
        return accessToken;
    }
}

module.exports = Service;
