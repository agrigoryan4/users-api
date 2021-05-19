const Exception = require('./Exception');

module.exports.ModelNoValidArgumentsException = class ModelNoValidArgumentsException extends Exception {
    constructor() {
        let message = 'No valid arguments provided'.toString();
        super(message);
    }
};

module.exports.ModelNotFoundException = class ModelNotFoundException extends Exception {
    constructor() {
        let message = 'Not found';
        let status = 404;
        super(message, status);
    }
};

module.exports.ModelValidationErrorException = class ModelValidationErrorException extends Exception {
    constructor() {
        message = 'No valid data provided as an argument';
        super(message);
    }
};
