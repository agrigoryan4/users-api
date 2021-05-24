const Exception = require('./Exception');

module.exports.UserValidationException = class UserValidationException extends Exception {
    constructor() {
        let status = 400;
        super(message, null, status);
    }
}

module.exports.UserAlreadyExistsException = class UserAlreadyExistsException extends Exception {
    constructor() {
        let message = 'User already exists';
        let status = 409;
        super(message, null, status);
    }
};

module.exports.UserNotFoundException = class UserNotFoundException extends Exception {
    constructor() {
        let message = 'User not found';
        let status = 404;
        super(message, null, status);
    }
};