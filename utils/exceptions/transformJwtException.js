const {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} = require('jsonwebtoken');
const {
  UnauthorizedException,
} = require('./userFacingExceptions');

const transformJwtException = (error, message) => {
  if (error instanceof JsonWebTokenError) {
    throw new UnauthorizedException(message || 'Token validation error');
  }
  if (error instanceof NotBeforeError) {
    throw new UnauthorizedException(message || 'Token not before error');
  }
  if (error instanceof TokenExpiredError) {
    throw new UnauthorizedException(message || 'Token expired');
  }
  throw error;
};

module.exports = transformJwtException;
