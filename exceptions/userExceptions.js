const Exception = require('./Exception');

module.exports.UserAlreadyExistsException = class UserAlreadyExistsException extends Exception {
    constructor() {
        let message = 'User already exists';
        let status = 409;
        super(message, status);
    }
};

module.exports.UserNotFoundException = class UserNotFoundException extends Exception {
    constructor() {
        let message = 'User not found';
        let status = 404;
        super(message, status);
    }
};