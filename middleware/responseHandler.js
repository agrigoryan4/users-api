
const responseHandler = (req, res, next) => {
    const { data, message } = res.respData;
    return res.status(res.statusCode || 200).json({
        data,
        message
    });
};

module.exports = responseHandler;
