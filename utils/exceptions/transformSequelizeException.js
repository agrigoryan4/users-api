const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  ExclusionConstraintError,
} = require('sequelize').Sequelize;
const {
  ValidationException,
  ConflictException,
} = require('./userFacingExceptions');

const transformSequelizeException = (error, message) => {
  if (error instanceof ValidationError) {
    const errorMessage = `${message || 'Validation error'}: ${error.message || ''}`;
    throw new ValidationException(errorMessage);
  }
  if (error instanceof UniqueConstraintError) {
    throw new ConflictException(message);
  }
  if (error instanceof ForeignKeyConstraintError) {
    throw new ValidationException(message);
  }
  if (error instanceof ExclusionConstraintError) {
    throw new ValidationException(message);
  }
  throw error;
};

module.exports = transformSequelizeException;
