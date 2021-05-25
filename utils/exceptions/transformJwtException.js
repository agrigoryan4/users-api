const {
    JsonWebTokenError,
    NotBeforeError,
    TokenExpiredError
} = require('jsonwebtoken');
const { 
    UnauthorizedException
} = require('./UserFacingExceptions');


const transformJwtException = (error, message) => {
    if(error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(message ? message : 'Token validation error');
    }
    if(error instanceof NotBeforeError) {
        throw new UnauthorizedException(message ? message : 'Token not before error');
    }
    if(error instanceof TokenExpiredError) {
        throw new UnauthorizedException(message ? message : 'Token expired');
    }
    else {
        throw error;
    }
};

module.exports = transformJwtException;
