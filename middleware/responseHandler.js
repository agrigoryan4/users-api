const responseHandler = (req, res, next) => {
  const { data } = res.respData;
  const status = res.statusCode || 200;
  let response = {
    _meta: { },
    data: null,
  };
  if(data?.count && !isNaN(data.count)) {
    const { page, limit } = req.query;
    response.data = data.rows;
    response._meta.pagination = {
      total: data.count,
      limit,
      offset: (page-1) * limit,
    };
  } else {
    response.data = data;
  }
  return res.status(status).json(response);
};

module.exports = responseHandler;
