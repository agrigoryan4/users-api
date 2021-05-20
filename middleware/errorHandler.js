
const errorHandler = (err, req, res, next) => {
    console.log(err.message);
    const { message, status, statusCode } = err;
    if(!message || (!status && !statusCode)) {
        return res.sendStatus(500);
    } else {
        return res.status(status || 500).json({ error: message, statusCode: statusCode });
    }
};



module.exports = errorHandler;