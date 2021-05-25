const { 
    ValidationException
} = require('./UserFacingExceptions');


const transformJoiException = (error, message) => {
    console.log(error);
    if(error.isJoi) {
        let joiMessages = error.details.map((detail) => {
            return detail.message;
        });
        let errorMessage = (message || 'Validation error') + ':  ' + joiMessages.join('; '); 
        throw new ValidationException(errorMessage);
    }
    else {
        throw error;
    }
};

module.exports = transformJoiException;
