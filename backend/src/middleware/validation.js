const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return errorResponse(res, errorMessages, 400);
  }
  
  next();
};

module.exports = validationMiddleware;