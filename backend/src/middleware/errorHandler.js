const { errorResponse } = require('../utils/response');

const handleCastErrorDB = (err) => {
  const message = `Recurso no encontrado con id: ${err.value}`;
  return { message, statusCode: 400 };
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'valor duplicado';
  const message = `Campo duplicado: ${value}. Por favor usa otro valor`;
  return { message, statusCode: 400 };
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Datos inválidos: ${errors.join('. ')}`;
  return { message, statusCode: 400 };
};

const handleJWTError = () => {
  return { 
    message: 'Token inválido. Por favor inicia sesión nuevamente', 
    statusCode: 401 
  };
};

const handleJWTExpiredError = () => {
  return { 
    message: 'Tu token ha expirado. Por favor inicia sesión nuevamente', 
    statusCode: 401 
  };
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Errores operacionales: enviar mensaje al cliente
  if (err.isOperational) {
    errorResponse(res, err.message, err.statusCode);
  } else {
    // Error de programación: no revelar detalles al cliente
    console.error('ERROR 💥', err);
    errorResponse(res, 'Algo salió mal en el servidor', 500);
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Errores específicos de MongoDB
    if (error.name === 'CastError') {
      const errorData = handleCastErrorDB(error);
      error.message = errorData.message;
      error.statusCode = errorData.statusCode;
      error.isOperational = true;
    }

    if (error.code === 11000) {
      const errorData = handleDuplicateFieldsDB(error);
      error.message = errorData.message;
      error.statusCode = errorData.statusCode;
      error.isOperational = true;
    }

    if (error.name === 'ValidationError') {
      const errorData = handleValidationErrorDB(error);
      error.message = errorData.message;
      error.statusCode = errorData.statusCode;
      error.isOperational = true;
    }

    if (error.name === 'JsonWebTokenError') {
      const errorData = handleJWTError();
      error.message = errorData.message;
      error.statusCode = errorData.statusCode;
      error.isOperational = true;
    }

    if (error.name === 'TokenExpiredError') {
      const errorData = handleJWTExpiredError();
      error.message = errorData.message;
      error.statusCode = errorData.statusCode;
      error.isOperational = true;
    }

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;