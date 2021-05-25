const { UserFacingException } = require('../utils/exceptions/UserFacingExceptions');

const errorHandler = (err, req, res, next) => {
    if(err instanceof UserFacingException) {
        return res.status(err.getStatusCode() || 500).json({
            error: {
                name: err.getName(),
                message: err.getMessage(),
                statusCode: err.getStatusCode()
            }
        });
    } else {
        res.sendStatus(500);
        throw err;
    }
};


module.exports = errorHandler;
