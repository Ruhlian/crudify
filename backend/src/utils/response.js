// src/utils/response.js - Helpers para respuestas consistentes
/**
 * Helper para respuestas exitosas
 * @param {Object} res - Objeto response de Express
 * @param {any} data - Datos a enviar
 * @param {string} message - Mensaje descriptivo
 * @param {number} statusCode - Código de estado HTTP (default: 200)
 */
const successResponse = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Helper para respuestas de error
   * @param {Object} res - Objeto response de Express
   * @param {string|Array} message - Mensaje(s) de error
   * @param {number} statusCode - Código de estado HTTP (default: 400)
   * @param {string} stack - Stack trace (solo en desarrollo)
   */
  const errorResponse = (res, message = 'Error en la operación', statusCode = 400, stack = null) => {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };
  
    // Agregar stack trace solo en desarrollo
    if (stack && process.env.NODE_ENV === 'development') {
      response.stack = stack;
    }
  
    return res.status(statusCode).json(response);
  };
  
  /**
   * Helper para respuestas paginadas
   * @param {Object} res - Objeto response de Express
   * @param {Array} data - Array de datos
   * @param {Object} pagination - Información de paginación
   * @param {string} message - Mensaje descriptivo
   */
  const paginatedResponse = (res, data, pagination, message = 'Datos obtenidos exitosamente') => {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Helper para respuesta de creación exitosa
   * @param {Object} res - Objeto response de Express
   * @param {any} data - Datos creados
   * @param {string} message - Mensaje descriptivo
   */
  const createdResponse = (res, data, message = 'Recurso creado exitosamente') => {
    return successResponse(res, data, message, 201);
  };
  
  /**
   * Helper para respuesta de actualización exitosa
   * @param {Object} res - Objeto response de Express
   * @param {any} data - Datos actualizados
   * @param {string} message - Mensaje descriptivo
   */
  const updatedResponse = (res, data, message = 'Recurso actualizado exitosamente') => {
    return successResponse(res, data, message, 200);
  };
  
  /**
   * Helper para respuesta de eliminación exitosa
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje descriptivo
   */
  const deletedResponse = (res, message = 'Recurso eliminado exitosamente') => {
    return successResponse(res, null, message, 200);
  };
  
  /**
   * Helper para respuesta de no encontrado
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje descriptivo
   */
  const notFoundResponse = (res, message = 'Recurso no encontrado') => {
    return errorResponse(res, message, 404);
  };
  
  /**
   * Helper para respuesta de no autorizado
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje descriptivo
   */
  const unauthorizedResponse = (res, message = 'No autorizado') => {
    return errorResponse(res, message, 401);
  };
  
  /**
   * Helper para respuesta de prohibido
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje descriptivo
   */
  const forbiddenResponse = (res, message = 'Acceso prohibido') => {
    return errorResponse(res, message, 403);
  };
  
  /**
   * Helper para respuesta de conflicto
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje descriptivo
   */
  const conflictResponse = (res, message = 'Conflicto en la operación') => {
    return errorResponse(res, message, 409);
  };
  
  /**
   * Helper para respuesta de validación fallida
   * @param {Object} res - Objeto response de Express
   * @param {Array|string} errors - Errores de validación
   */
  const validationErrorResponse = (res, errors) => {
    const message = Array.isArray(errors) ? errors : [errors];
    return errorResponse(res, message, 422);
  };
  
  /**
   * Helper para respuesta de servidor interno
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje descriptivo
   */
  const serverErrorResponse = (res, message = 'Error interno del servidor') => {
    return errorResponse(res, message, 500);
  };
  
  /**
   * Helper para respuesta personalizada
   * @param {Object} res - Objeto response de Express
   * @param {number} statusCode - Código de estado HTTP
   * @param {boolean} success - Si la operación fue exitosa
   * @param {string} message - Mensaje descriptivo
   * @param {any} data - Datos a enviar
   * @param {Object} extra - Propiedades adicionales
   */
  const customResponse = (res, statusCode, success, message, data = null, extra = {}) => {
    const response = {
      success,
      message,
      ...(data && { data }),
      timestamp: new Date().toISOString(),
      ...extra
    };
  
    return res.status(statusCode).json(response);
  };
  
  module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
    createdResponse,
    updatedResponse,
    deletedResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    conflictResponse,
    validationErrorResponse,
    serverErrorResponse,
    customResponse
  };