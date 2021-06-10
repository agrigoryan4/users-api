// constants
const { DEFAULT_LIMIT, DEFAULT_OFFSET } = require('../utils/constants/pagination');

async function responseHandler(req, res, next) {
  const { data } = res.respData;
  const status = res.statusCode || 200;
  const response = {
    _meta: { },
    data: null,
  };
  if (data.rows instanceof Array && data?.count && !isNaN(data.count)) {
    const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = req.query;
    response.data = data.rows;
    response._meta.pagination = {
      total: data.count,
      limit,
      offset,
    };
  } else {
    response.data = data;
  }
  return res.status(status).json(response);
}

module.exports = responseHandler;
