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

