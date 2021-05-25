const { auth: AuthService } = require('../services');

class Auth {
    static async getAccessToken(username, password) {
        const user = await AuthService.authenticate(username, password);
        const token = await AuthService.generateTokenById(user.id);
        return token;
    }
}

module.exports = Auth;
