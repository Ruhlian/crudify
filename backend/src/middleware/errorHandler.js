// src/middleware/errorHandler.js - Manejo de errores
const { errorResponse } = require('../utils/response');

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Middleware principal de manejo de errores
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log del error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', err);
    console.error('📍 Stack:', err.stack);
  }

  // Error de ID inválido de MongoDB
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error.statusCode = 404;
    error.message = message;
  }

  // Error de duplicado de MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `El ${field} '${value}' ya existe`;
    error.statusCode = 400;
    error.message = message;
  }

  // Error de validación de MongoDB
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.statusCode = 400;
    error.message = messages;
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error.statusCode = 401;
    error.message = message;
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error.statusCode = 401;
    error.message = message;
  }

  // Error de conexión a base de datos
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    const message = 'Error de base de datos';
    error.statusCode = 500;
    error.message = message;
  }

  // Error de timeout
  if (err.code === 'ECONNABORTED') {
    const message = 'Tiempo de espera agotado';
    error.statusCode = 408;
    error.message = message;
  }

  // Error de límite de tamaño
  if (err.type === 'entity.too.large') {
    const message = 'Archivo demasiado grande';
    error.statusCode = 413;
    error.message = message;
  }

  // Respuesta de error usando helper
  return errorResponse(
    res, 
    error.message, 
    error.statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
};

// Manejo de errores asincrónicos
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Manejo de promesas no capturadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // Cerrar servidor gracefully
  process.exit(1);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

module.exports = {
  notFound,
  errorHandler,
  asyncHandler
};