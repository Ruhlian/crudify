// src/middleware/validation.js - Middleware de validación
const mongoose = require('mongoose');
const { errorResponse } = require('../utils/response');

// Validar datos de usuario
const validateUser = (req, res, next) => {
  const { nombre, email, edad, telefono } = req.body;
  const errors = [];

  // Validar nombre
  if (!nombre || typeof nombre !== 'string') {
    errors.push('El nombre es obligatorio y debe ser texto');
  } else if (nombre.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  } else if (nombre.trim().length > 50) {
    errors.push('El nombre no puede exceder 50 caracteres');
  }

  // Validar email
  if (!email || typeof email !== 'string') {
    errors.push('El email es obligatorio');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('El formato del email es inválido');
    }
  }

  // Validar edad (opcional)
  if (edad !== undefined) {
    if (typeof edad !== 'number' || !Number.isInteger(edad)) {
      errors.push('La edad debe ser un número entero');
    } else if (edad < 0 || edad > 120) {
      errors.push('La edad debe estar entre 0 y 120 años');
    }
  }

  // Validar teléfono (opcional)
  if (telefono !== undefined && telefono !== '') {
    if (typeof telefono !== 'string') {
      errors.push('El teléfono debe ser texto');
    } else {
      const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,20}$/;
      if (!phoneRegex.test(telefono.trim())) {
        errors.push('El formato del teléfono es inválido');
      }
    }
  }

  // Si hay errores, devolver respuesta de error
  if (errors.length > 0) {
    return errorResponse(res, errors, 400);
  }

  // Limpiar y formatear datos
  req.body.nombre = nombre.trim();
  req.body.email = email.trim().toLowerCase();
  if (telefono) req.body.telefono = telefono.trim();

  next();
};

// Validar ID de MongoDB
const validateUserId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 'ID de usuario inválido', 400);
  }

  next();
};

// Validar parámetros de consulta
const validateQueryParams = (req, res, next) => {
  const { pagina, limite, activo, ordenar, orden } = req.query;

  // Validar página
  if (pagina && (!Number.isInteger(parseInt(pagina)) || parseInt(pagina) < 1)) {
    return errorResponse(res, 'El parámetro "pagina" debe ser un número entero mayor a 0', 400);
  }

  // Validar límite
  if (limite && (!Number.isInteger(parseInt(limite)) || parseInt(limite) < 1 || parseInt(limite) > 100)) {
    return errorResponse(res, 'El parámetro "limite" debe ser un número entre 1 y 100', 400);
  }

  // Validar activo
  if (activo && !['true', 'false', 'all'].includes(activo)) {
    return errorResponse(res, 'El parámetro "activo" debe ser true, false o all', 400);
  }

  // Validar campo de ordenamiento
  const camposValidos = ['nombre', 'email', 'edad', 'createdAt', 'updatedAt'];
  if (ordenar && !camposValidos.includes(ordenar)) {
    return errorResponse(res, `El parámetro "ordenar" debe ser uno de: ${camposValidos.join(', ')}`, 400);
  }

  // Validar orden
  if (orden && !['asc', 'desc'].includes(orden)) {
    return errorResponse(res, 'El parámetro "orden" debe ser asc o desc', 400);
  }

  next();
};

// Validar datos de dirección
const validateAddress = (req, res, next) => {
  const { direccion } = req.body;

  if (direccion && typeof direccion === 'object') {
    const { calle, ciudad, codigoPostal, pais } = direccion;
    const errors = [];

    if (calle && (typeof calle !== 'string' || calle.trim().length < 3)) {
      errors.push('La calle debe tener al menos 3 caracteres');
    }

    if (ciudad && (typeof ciudad !== 'string' || ciudad.trim().length < 2)) {
      errors.push('La ciudad debe tener al menos 2 caracteres');
    }

    if (codigoPostal && (typeof codigoPostal !== 'string' || !/^\d{5,6}$/.test(codigoPostal))) {
      errors.push('El código postal debe tener 5 o 6 dígitos');
    }

    if (pais && (typeof pais !== 'string' || pais.trim().length < 2)) {
      errors.push('El país debe tener al menos 2 caracteres');
    }

    if (errors.length > 0) {
      return errorResponse(res, errors, 400);
    }
  }

  next();
};

// Validar preferencias de usuario
const validatePreferences = (req, res, next) => {
  const { preferencias } = req.body;

  if (preferencias && typeof preferencias === 'object') {
    const { tema, idioma, notificaciones } = preferencias;
    const errors = [];

    if (tema && !['claro', 'oscuro', 'auto'].includes(tema)) {
      errors.push('El tema debe ser: claro, oscuro o auto');
    }

    if (idioma && !['es', 'en', 'fr'].includes(idioma)) {
      errors.push('El idioma debe ser: es, en o fr');
    }

    if (notificaciones && typeof notificaciones === 'object') {
      const { email, sms, push } = notificaciones;
      
      if (email !== undefined && typeof email !== 'boolean') {
        errors.push('La preferencia de notificación por email debe ser true o false');
      }
      
      if (sms !== undefined && typeof sms !== 'boolean') {
        errors.push('La preferencia de notificación por SMS debe ser true o false');
      }
      
      if (push !== undefined && typeof push !== 'boolean') {
        errors.push('La preferencia de notificación push debe ser true o false');
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, errors, 400);
    }
  }

  next();
};

// Middleware compuesto para validación completa de usuario
const validateCompleteUser = [
  validateUser,
  validateAddress,
  validatePreferences
];

module.exports = {
  validateUser,
  validateUserId,
  validateQueryParams,
  validateAddress,
  validatePreferences,
  validateCompleteUser
};