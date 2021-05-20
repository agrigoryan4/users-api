const Exception = require('./Exception');
const {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    ExclusionConstraintError,
} = require('sequelize').Sequelize;

module.exports.DatabaseException = class DatabaseException extends Exception {
    constructor(error) {
        super(error.message);
        if(error instanceof ValidationError) {
            this.message = 'Error occured during validation of the request.';
            this.statusCode = 'VALIDATION_ERROR';
        }
        if(error instanceof UniqueConstraintError) {
            this.message = 'Resource conflict.';
            this.statusCode = 'VALIDATION_ERROR';
        }
        if(error instanceof ForeignKeyConstraintError) {
            this.message = 'Unable to perform the request. Invalid data.';
            this.statusCode = 'VALIDATION_ERROR';
        }
        if(error instanceof ExclusionConstraintError) {
            this.message = 'Unable to perform the request. Invalid data.';
            this.statusCode = 'VALIDATION_ERROR'; 
        }
        else {
            this.message = 'Unexpected error occured during operation.';
            this.statusCode = 'INTERNAL_ERROR'; 
        }
    }
}

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
