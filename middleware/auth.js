const jwt = require('jsonwebtoken');
// exceptions
const {
  UnauthorizedException,
} = require('../utils/exceptions/userFacingExceptions');
const transformJwtException = require('../utils/exceptions/transformJwtException');

async function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return next(new UnauthorizedException('Authorization token missing'));
  }
  const token = authHeader.split(' ')[1];
  try {
    try {
      const tokenPayload = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      // check for expiration
      const currentTimestamp = Date.now();
      const expirationTimestamp = Date.parse(tokenPayload.expires);
      if (expirationTimestamp - currentTimestamp <= 0) {
        throw new UnauthorizedException('Token has expired');
      }
      // populate the req object with the id of the user
      req.user = {
        id: tokenPayload.id,
      };
      next();
    } catch (error) {
      transformJwtException(error);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = auth;
