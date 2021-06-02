const {
  ValidationException,
} = require('./userFacingExceptions');

const transformJoiException = (error, message) => {
  if (error.isJoi) {
    const joiMessages = error.details.map((detail) => detail.message);
    const errorMessage = `${(message || 'Validation error')}:  ${joiMessages.join('; ')}`;
    throw new ValidationException(errorMessage);
  } else {
    throw error;
  }
};

module.exports = transformJoiException;
