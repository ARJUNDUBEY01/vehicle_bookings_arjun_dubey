exports.success = (res, data, message = 'Success', statusCode = 200, pagination = null) => {
  const response = {
    success: true,
    message,
    data
  };
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return res.status(statusCode).json(response);
};

exports.error = (res, message = 'Error', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  } else if (error && typeof error === 'string') {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};
