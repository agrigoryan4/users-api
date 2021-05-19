
const errorHandler = (err, req, res, next) => {
    const { message, status } = err;
    if(!message || !status) return res.sendStatus(500);
    return res.status(status).json({ error: message });
};



module.exports = errorHandler;