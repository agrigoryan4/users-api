const Exception = require('./Exception');

class UserFacingException extends Exception {
    constructor(message, name, statusCode) {
        super(message, name);
        this.statusCode = statusCode;
    }
    getStatusCode() {
        return this.statusCode;
    }
}

module.exports.UserFacingException = UserFacingException;

module.exports.BadRequestException = class BadRequestException extends UserFacingException {
    constructor(message) {
        super(message, 'Bad Request', 400);
    }
}

module.exports.ValidationException = class ValidationException extends UserFacingException {
    constructor(message) {
        super(message, 'Validation Error', 403);
    }
}

module.exports.ConflictException = class ConflictException extends UserFacingException {
    constructor(message) {
        super(message, 'Resource Conflict Error', 409);
    }
}

module.exports.NotFoundException = class NotFoundException extends UserFacingException {
    constructor(message) {
        super(message, 'Not found', 404);
    }
}

module.exports.UnauthorizedException = class UnauthorizedException extends UserFacingException {
    constructor(message) {
        super(message, 'Unauthorized', 401);
    }
}

module.exports.ForbidenException = class ForbidenException extends UserFacingException {
    constructor(message) {
        super(message, 'Forbidden', 403);
    }
}
