// src/controllers/userController.js - Controlador de Usuario
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

class UserController {
  
  // Obtener todos los usuarios
  static async getAllUsers(req, res, next) {
    try {
      const { 
        pagina = 1, 
        limite = 10, 
        activo = 'true',
        buscar = '',
        ordenar = 'createdAt',
        orden = 'desc'
      } = req.query;

      // Construir filtros
      const filtros = {};
      if (activo !== 'all') {
        filtros.activo = activo === 'true';
      }
      
      if (buscar) {
        filtros.$or = [
          { nombre: { $regex: buscar, $options: 'i' } },
          { email: { $regex: buscar, $options: 'i' } }
        ];
      }

      // Configurar paginación
      const skip = (parseInt(pagina) - 1) * parseInt(limite);
      const sortOrder = orden === 'desc' ? -1 : 1;

      // Ejecutar consulta
      const [usuarios, total] = await Promise.all([
        User.find(filtros)
          .sort({ [ordenar]: sortOrder })
          .skip(skip)
          .limit(parseInt(limite))
          .lean(),
        User.countDocuments(filtros)
      ]);

      // Información de paginación
      const paginacion = {
        paginaActual: parseInt(pagina),
        totalPaginas: Math.ceil(total / parseInt(limite)),
        totalUsuarios: total,
        usuariosPorPagina: parseInt(limite),
        tieneAnterior: parseInt(pagina) > 1,
        tieneSiguiente: parseInt(pagina) < Math.ceil(total / parseInt(limite))
      };

      return successResponse(res, {
        usuarios,
        paginacion
      }, 'Usuarios obtenidos exitosamente');

    } catch (error) {
      next(error);
    }
  }

  // Obtener usuario por ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const usuario = await User.findById(id);
      
      if (!usuario) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      return successResponse(res, usuario, 'Usuario obtenido exitosamente');

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
      const { nombre, email, edad, telefono, direccion, preferencias } = req.body;

      // Verificar si el email ya existe
      const usuarioExistente = await User.buscarPorEmail(email);
      if (usuarioExistente) {
        return errorResponse(res, 'El email ya está registrado', 400);
      }

      // Crear nuevo usuario
      const nuevoUsuario = new User({
        nombre,
        email,
        edad,
        telefono,
        direccion,
        preferencias
      });

      const usuarioGuardado = await nuevoUsuario.save();

      return successResponse(
        res, 
        usuarioGuardado, 
        'Usuario creado exitosamente', 
        201
      );

    } catch (error) {
      if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map(err => err.message);
        return errorResponse(res, errores, 400);
      }
      next(error);
    }
  }

  // Actualizar usuario
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const actualizaciones = req.body;

      // Si se actualiza el email, verificar que no esté en uso
      if (actualizaciones.email) {
        const usuarioConEmail = await User.buscarPorEmail(actualizaciones.email);
        if (usuarioConEmail && usuarioConEmail._id.toString() !== id) {
          return errorResponse(res, 'El email ya está en uso por otro usuario', 400);
        }
      }

      const usuarioActualizado = await User.findByIdAndUpdate(
        id,
        actualizaciones,
        { 
          new: true, 
          runValidators: true,
          context: 'query'
        }
      );

      if (!usuarioActualizado) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      return successResponse(
        res, 
        usuarioActualizado, 
        'Usuario actualizado exitosamente'
      );

    } catch (error) {
      if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map(err => err.message);
        return errorResponse(res, errores, 400);
      }
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  // Eliminar usuario (soft delete)
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id);
      if (!usuario) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      await usuario.desactivar();

      return successResponse(
        res, 
        null, 
        'Usuario eliminado exitosamente'
      );

    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  // Eliminar usuario permanentemente
  static async deleteUserPermanent(req, res, next) {
    try {
      const { id } = req.params;

      const usuarioEliminado = await User.findByIdAndDelete(id);
      
      if (!usuarioEliminado) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      return successResponse(
        res, 
        null, 
        'Usuario eliminado permanentemente'
      );

    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de usuario inválido', 400);
      }
      next(error);
    }
  }

  // Reactivar usuario
  static async reactivateUser(req, res, next) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id);
      if (!usuario) {
        return errorResponse(res, 'Usuario no encontrado', 404);
      }

      await usuario.activar();

      return successResponse(
        res, 
        usuario, 
        'Usuario reactivado exitosamente'
      );

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
      const [
        totalUsuarios,
        usuariosActivos,
        usuariosInactivos,
        usuariosAdultos,
        usuariosMenores
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ activo: true }),
        User.countDocuments({ activo: false }),
        User.contarPorEdad(18, 120),
        User.contarPorEdad(0, 17)
      ]);

      const estadisticas = {
        total: totalUsuarios,
        activos: usuariosActivos,
        inactivos: usuariosInactivos,
        adultos: usuariosAdultos,
        menores: usuariosMenores,
        porcentajeActivos: totalUsuarios > 0 ? ((usuariosActivos / totalUsuarios) * 100).toFixed(2) : 0
      };

      return successResponse(
        res, 
        estadisticas, 
        'Estadísticas obtenidas exitosamente'
      );

    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;