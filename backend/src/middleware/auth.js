// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Acceso no autorizado - Token requerido', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Token inválido o expirado', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Acceso denegado - No tienes permisos suficientes', 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};