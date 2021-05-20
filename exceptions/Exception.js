
class Exception extends Error {
    constructor(message, statusCode, status) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = status;
    }
}

module.exports = Exception;
