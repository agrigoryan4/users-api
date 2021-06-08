const { users: UsersService } = require('../services');

class UsersController {
  static async addUser(username, password) {
    const newUser = await UsersService.createUser(username, password);
    return newUser;
  }

  static async getUsers({ pagination, filter }) {
    const users = await UsersService.getAllUsers(pagination, filter);
    return users;
  }

  static async getUser(id) {
    const user = await UsersService.getUserById(id);
    return user;
  }

  static async deleteUser(id) {
    const result = await UsersService.deleteUserById(id);
    return result;
  }

  static async editUser(id, { username }) {
    await UsersService.updateUser(id, { username });
  }
}

module.exports = UsersController;
