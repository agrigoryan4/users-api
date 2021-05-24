const Exception = require('./Exception');

module.exports.HttpBadRequestException = class HttpBadRequestException extends Exception {
    constructor() {
        let message = 'Bad request';
        let status = 400;
        super(message, null, status);
    }
};
