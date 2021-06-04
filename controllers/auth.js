const { auth: AuthService } = require('../services');

class Auth {
  static async getAccessToken(username, password) {
    const token = await AuthService.login({ username, password });
    return token;
  }
}

module.exports = Auth;
