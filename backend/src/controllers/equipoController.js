const Equipo = require('../models/equipoModel');
const Asignacion = require('../models/asignacionModel');
const { successResponse, errorResponse } = require('../utils/response');
const APIFeatures = require('../utils/APIFeatures');

class EquipoController {
  // Obtener todos los equipos con paginación
  static async getAll(req, res, next) {
    try {
      const features = new APIFeatures(Equipo.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const equipos = await features.query;
      const total = await Equipo.countDocuments(features.filterQuery);

      const pagination = {
        pagina: features.pagina,
        limite: features.limite,
        totalPaginas: Math.ceil(total / features.limite),
        totalEquipos: total
      };

      successResponse(res, { equipos, pagination }, 'Equipos obtenidos con éxito');
    } catch (error) {
      next(error);
    }
  }

  // Obtener equipo por ID
  static async getById(req, res, next) {
    try {
      const equipo = await Equipo.findById(req.params.id);
      
      if (!equipo) {
        return errorResponse(res, 'Equipo no encontrado', 404);
      }

      successResponse(res, equipo, 'Equipo obtenido con éxito');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de equipo no válido', 400);
      }
      next(error);
    }
  }

  // Crear nuevo equipo
  static async create(req, res, next) {
    try {
      const { serial } = req.body;

      // Verificar si el serial ya existe
      const existingEquipo = await Equipo.findOne({ serial });

      if (existingEquipo) {
        return errorResponse(res, 'El serial ya está registrado', 400);
      }

      const newEquipo = await Equipo.create(req.body);
      successResponse(res, newEquipo, 'Equipo creado con éxito', 201);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      next(error);
    }
  }

  // Actualizar equipo
  static async update(req, res, next) {
    try {
      const equipo = await Equipo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!equipo) {
        return errorResponse(res, 'Equipo no encontrado', 404);
      }

      successResponse(res, equipo, 'Equipo actualizado con éxito');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de equipo inválido', 400);
      }
      next(error);
    }
  }

  // Obtener equipos por estado (Bodega, Reposo, Alistamiento)
  static async getEquiposPorEstado(req, res, next) {
    try {
      const { estado } = req.params;
      const estadosValidos = ['Bodega', 'Reposo', 'Alistamiento'];
      
      if (!estadosValidos.includes(estado)) {
        return errorResponse(res, 'Estado no válido', 400);
      }

      const equipos = await Equipo.find({ estado })
        .sort({ createdAt: -1 });

      return successResponse(res, equipos, `Equipos en ${estado} obtenidos correctamente`);
    } catch (error) {
      next(error);
    }
  }

  // Obtener historial de asignaciones de un equipo
  static async getHistorialAsignaciones(req, res, next) {
    try {
      const { equipoId } = req.params;
      
      const asignaciones = await Asignacion.find({ equipo: equipoId })
        .sort({ fechaAsignacion: -1 })
        .populate('usuario', 'idUsuario nombre cargo sede');

      return successResponse(res, asignaciones, 'Historial de asignaciones obtenido');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de equipo no válido', 400);
      }
      next(error);
    }
  }
}

module.exports = EquipoController;