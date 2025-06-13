const Asignacion = require('../models/asignacionModel');
const Equipo = require('../models/equipoModel');
const Usuario = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/response');

class AsignacionController {
  /**
   * Crear una nueva asignación
   */
  static async crear(req, res, next) {
    try {
      const { equipo, usuario, fechaAsignacion, comentario } = req.body;

      // Validar que el equipo existe
      const equipoExistente = await Equipo.findById(equipo);
      if (!equipoExistente) {
        return errorResponse(res, 'El equipo no existe', 404);
      }

      // Validar que el usuario existe
      const usuarioExistente = await Usuario.findById(usuario);
      if (!usuarioExistente) {
        return errorResponse(res, 'El usuario no existe', 404);
      }

      // Validar que el equipo no esté ya asignado
      const asignacionExistente = await Asignacion.findOne({ 
        equipo, 
        activo: true 
      });
      
      if (asignacionExistente) {
        return errorResponse(res, 'Este equipo ya está asignado a otro usuario', 400);
      }

      // Crear la asignación
      const nuevaAsignacion = await Asignacion.create({
        equipo,
        usuario,
        fechaAsignacion: fechaAsignacion || Date.now(),
        comentario,
        activo: true
      });

      // Actualizar el estado del equipo
      await Equipo.findByIdAndUpdate(equipo, { 
        estado: 'Asignado',
        ultimaAsignacion: nuevaAsignacion._id 
      });

      successResponse(res, nuevaAsignacion, 'Asignación creada exitosamente', 201);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      next(error);
    }
  }

  /**
   * Obtener todas las asignaciones activas
   */
  static async obtenerTodas(req, res, next) {
    try {
      const { activo } = req.query;
      const filtro = activo ? { activo: activo === 'true' } : {};
      
      const asignaciones = await Asignacion.find(filtro)
        .populate('usuario', 'nombre cargo sede')
        .populate('equipo', 'tipoEquipo marca modelo serial estado')
        .sort({ fechaAsignacion: -1 });

      successResponse(res, asignaciones, 'Asignaciones obtenidas correctamente');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener una asignación por ID
   */
  static async obtenerPorId(req, res, next) {
    try {
      const asignacion = await Asignacion.findById(req.params.id)
        .populate('usuario', 'nombre cargo sede')
        .populate('equipo', 'tipoEquipo marca modelo serial estado');

      if (!asignacion) {
        return errorResponse(res, 'Asignación no encontrada', 404);
      }

      successResponse(res, asignacion, 'Asignación obtenida correctamente');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de asignación inválido', 400);
      }
      next(error);
    }
  }

  /**
   * Finalizar una asignación (marcar como inactiva)
   */
  static async finalizar(req, res, next) {
    try {
      const asignacion = await Asignacion.findByIdAndUpdate(
        req.params.id,
        { 
          activo: false,
          fechaDevolucion: Date.now() 
        },
        { new: true }
      );

      if (!asignacion) {
        return errorResponse(res, 'Asignación no encontrada', 404);
      }

      // Actualizar el estado del equipo a "Reposo"
      await Equipo.findByIdAndUpdate(asignacion.equipo, { 
        estado: 'Reposo',
        ultimaAsignacion: asignacion._id 
      });

      successResponse(res, asignacion, 'Asignación finalizada correctamente');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de asignación inválido', 400);
      }
      next(error);
    }
  }

  /**
   * Obtener asignaciones por usuario
   */
  static async porUsuario(req, res, next) {
    try {
      const asignaciones = await Asignacion.find({ 
        usuario: req.params.usuarioId 
      })
      .populate('equipo', 'tipoEquipo marca modelo serial estado')
      .sort({ fechaAsignacion: -1 });

      successResponse(res, asignaciones, 'Asignaciones por usuario obtenidas');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  /**
   * Obtener historial de un equipo
   */
  static async historialEquipo(req, res, next) {
    try {
      const asignaciones = await Asignacion.find({ 
        equipo: req.params.equipoId 
      })
      .populate('usuario', 'nombre cargo sede')
      .sort({ fechaAsignacion: -1 });

      successResponse(res, asignaciones, 'Historial del equipo obtenido');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de equipo inválido', 400);
      }
      next(error);
    }
  }
}

module.exports = AsignacionController;