const User = require('../models/userModel');
const Asignacion = require('../models/asignacionModel');
const { successResponse, errorResponse } = require('../utils/response');
const APIFeatures = require('../utils/apiFeatures');

class UserController {
  // Obtener todos los usuarios con paginación y filtros
  static async getAllUsers(req, res, next) {
    try {
      const features = new APIFeatures(User.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const users = await features.query;
      const total = await User.countDocuments(features.filterQuery);

      const pagination = {
        pagina: features.pagina,
        limite: features.limite,
        totalPaginas: Math.ceil(total / features.limite),
        totalUsuarios: total
      };

      successResponse(res, { users, pagination }, 'Usuarios obtenidos con éxito');
    } catch (error) {
      next(error);
    }
  }

  // Obtener usuario por ID con equipos asignados
  static async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id)
        .populate({
          path: 'equiposAsignados',
          populate: {
            path: 'equipo',
            select: 'tipoEquipo marca modelo serial estado'
          }
        });

      if (!user) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      successResponse(res, user, 'Usuario obtenido con éxito');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  // Crear nuevo usuario
  static async createUser(req, res, next) {
    try {
      const { idUsuario, email } = req.body;

      // Verificar si ID o email ya existen
      const [existingId, existingEmail] = await Promise.all([
        User.findOne({ idUsuario }),
        User.findOne({ email: email.toLowerCase() })
      ]);

      if (existingId) {
        return errorResponse(res, 'El ID de usuario ya existe', 400);
      }
      if (existingEmail) {
        return errorResponse(res, 'El email ya está registrado', 400);
      }

      const newUser = await User.create(req.body);
      newUser.password = undefined;

      successResponse(res, newUser, 'Usuario creado con éxito', 201);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      next(error);
    }
  }

  // Actualizar usuario
  static async updateUser(req, res, next) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).select('-password');

      if (!user) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      successResponse(res, user, 'Usuario actualizado con éxito');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  // Desactivar usuario (soft delete)
  static async deactivateUser(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      // Verificar si tiene equipos asignados
      const asignacionesActivas = await Asignacion.countDocuments({
        usuario: user._id,
        activo: true
      });

      if (asignacionesActivas > 0) {
        return errorResponse(
          res, 
          'No se puede desactivar usuario con equipos asignados', 
          400
        );
      }

      await user.desactivar();
      successResponse(res, null, 'Usuario desactivado con éxito');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  // Obtener equipos asignados a un usuario
  static async getUserEquipment(req, res, next) {
    try {
      const asignaciones = await Asignacion.find({
        usuario: req.params.id,
        activo: true
      }).populate('equipo', 'tipoEquipo marca modelo serial estado');

      successResponse(res, asignaciones, 'Equipos asignados obtenidos con éxito');
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  // Estadísticas de usuarios
  static async getUserStats(req, res, next) {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$cargo',
            count: { $sum: 1 },
            activos: { $sum: { $cond: [{ $eq: ['$activo', true] }, 1, 0] } }
          }
        },
        {
          $project: {
            cargo: '$_id',
            total: '$count',
            activos: 1,
            inactivos: { $subtract: ['$count', '$activos'] },
            _id: 0
          }
        }
      ]);

      successResponse(res, stats, 'Estadísticas obtenidas con éxito');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;