const {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    ExclusionConstraintError,
} = require('sequelize').Sequelize;
const { 
    ValidationException,
    ConflictException
} = require('./UserFacingExceptions');


const transformSequelizeException  = (error, message) => {
    if(error instanceof ValidationError) {
        const errorMessage = (message) + ':   ' + (error.message || '');  
        throw new ValidationException(errorMessage);
    }
    else if(error instanceof UniqueConstraintError) {
        throw new ConflictException(message);
    }
    else if(error instanceof ForeignKeyConstraintError) {
        throw new ValidationException(message);
    }
    else if(error instanceof ExclusionConstraintError) {
        throw new ValidationException(message);
    }
    else {
        throw error;
    }
};


module.exports = transformSequelizeException;
