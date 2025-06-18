const Equipo = require('../models/equipoModel');
const Asignacion = require('../models/asignacionModel');
const { successResponse, errorResponse } = require('../utils/response');
const APIFeatures = require('../utils/APIFeatures');

class EquipoController {
  // Obtener todos los equipos con paginación y búsqueda
  static async getAll(req, res, next) {
    try {
      console.log('🔍 Query params recibidos:', req.query);

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

      console.log(`✅ Encontrados ${equipos.length} equipos de ${total} totales`);

      successResponse(res, { equipos, pagination }, 'Equipos obtenidos con éxito');
    } catch (error) {
      console.error('❌ Error en getAll:', error);
      next(error);
    }
  }

  // Obtener equipo por ID (acepta tanto _id como idEquipo)
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      let equipo;

      // 🔍 Intentar buscar por idEquipo primero (formato EQ-XXXX)
      if (id.startsWith('EQ-')) {
        equipo = await Equipo.findByIdEquipo(id);
      } else {
        // Si no es formato idEquipo, buscar por _id de MongoDB
        equipo = await Equipo.findById(id);
      }
      
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

  // ✨ CREAR NUEVO EQUIPO - SIMPLIFICADO
  static async create(req, res, next) {
    try {
      console.log('=== CREANDO NUEVO EQUIPO ===');
      console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2));

      // 🔍 Verificar si req.body existe y no está vacío
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log('❌ req.body está vacío');
        return errorResponse(res, 'No se recibieron datos para crear el equipo', 400);
      }

      const { serial } = req.body;

      // ✅ Validar serial (campo requerido)
      if (!serial || serial.trim() === '') {
        return errorResponse(res, 'El campo "serial" es requerido', 400);
      }

      // 🔍 Verificar si el serial ya existe
      const existingEquipo = await Equipo.findBySerial(serial);
      if (existingEquipo) {
        return errorResponse(res, `El serial "${serial}" ya está registrado`, 400);
      }

      // ✨ CREAR EQUIPO - El idEquipo se genera automáticamente en el modelo
      console.log('🚀 Creando equipo...');
      const newEquipo = await Equipo.create(req.body);
      
      console.log(`✅ Equipo creado exitosamente:`);
      console.log(`   📋 ID: ${newEquipo.idEquipo}`);
      console.log(`   🔢 Serial: ${newEquipo.serial}`);
      console.log(`   📱 Tipo: ${newEquipo.tipoEquipo}`);
      console.log(`   📊 Estado: ${newEquipo.estado}`);
      
      // 🎯 Respuesta exitosa
      successResponse(res, {
        ...newEquipo.toObject(),
        mensaje: `Equipo creado exitosamente con ID: ${newEquipo.idEquipo}`
      }, `Equipo ${newEquipo.idEquipo} creado con éxito`, 201);
      
    } catch (error) {
      console.error('❌ Error en create:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      
      if (error.code === 11000) {
        // Error de duplicado
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[field];
        return errorResponse(res, `El ${field} "${value}" ya está registrado`, 400);
      }
      
      next(error);
    }
  }

  // Actualizar equipo (acepta tanto _id como idEquipo)
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      let equipo;

      console.log(`🔄 Actualizando equipo: ${id}`);
      console.log('📦 Datos a actualizar:', JSON.stringify(req.body, null, 2));

      // 🔍 Buscar equipo por idEquipo o _id
      if (id.startsWith('EQ-')) {
        equipo = await Equipo.findOneAndUpdate(
          { idEquipo: id },
          req.body,
          { new: true, runValidators: true }
        );
      } else {
        equipo = await Equipo.findByIdAndUpdate(
          id,
          req.body,
          { new: true, runValidators: true }
        );
      }

      if (!equipo) {
        return errorResponse(res, 'Equipo no encontrado', 404);
      }

      console.log(`✅ Equipo ${equipo.idEquipo} actualizado exitosamente`);
      successResponse(res, equipo, 'Equipo actualizado con éxito');
    } catch (error) {
      console.error('❌ Error en update:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de equipo inválido', 400);
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[field];
        return errorResponse(res, `El ${field} "${value}" ya está registrado`, 400);
      }
      next(error);
    }
  }

  // Obtener equipos por estado
  static async getEquiposPorEstado(req, res, next) {
    try {
      const { estado } = req.params;
      const estadosValidos = ['Bodega', 'Asignado', 'Reposo', 'Alistamiento', 'Mantenimiento', 'Baja'];
      
      if (!estadosValidos.includes(estado)) {
        return errorResponse(res, `Estado no válido. Estados permitidos: ${estadosValidos.join(', ')}`, 400);
      }

      const equipos = await Equipo.find({ estado })
        .sort({ createdAt: -1 });

      console.log(`📊 Encontrados ${equipos.length} equipos en estado: ${estado}`);
      return successResponse(res, equipos, `${equipos.length} equipos en estado ${estado}`);
    } catch (error) {
      next(error);
    }
  }

  // Obtener historial de asignaciones de un equipo
  static async getHistorialAsignaciones(req, res, next) {
    try {
      const { equipoId } = req.params;
      let equipo;

      // 🔍 Buscar el equipo primero
      if (equipoId.startsWith('EQ-')) {
        equipo = await Equipo.findByIdEquipo(equipoId);
      } else {
        equipo = await Equipo.findById(equipoId);
      }

      if (!equipo) {
        return errorResponse(res, 'Equipo no encontrado', 404);
      }

      // Buscar asignaciones usando el _id interno del equipo
      const asignaciones = await Asignacion.find({ equipo: equipo._id })
        .sort({ fechaAsignacion: -1 })
        .populate('usuario', 'idUsuario nombre cargo sede');

      console.log(`📋 Historial para ${equipo.idEquipo}: ${asignaciones.length} asignaciones`);
      return successResponse(res, asignaciones, `Historial de ${equipo.idEquipo}: ${asignaciones.length} asignaciones`);
    } catch (error) {
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de equipo no válido', 400);
      }
      next(error);
    }
  }

  // Buscar equipo por serial
  static async getBySerial(req, res, next) {
    try {
      const { serial } = req.params;
      
      const equipo = await Equipo.findBySerial(serial);
      
      if (!equipo) {
        return errorResponse(res, `Equipo con serial "${serial}" no encontrado`, 404);
      }

      successResponse(res, equipo, 'Equipo encontrado por serial');
    } catch (error) {
      next(error);
    }
  }

  // Método de búsqueda general
  static async search(req, res, next) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim() === '') {
        return errorResponse(res, 'Término de búsqueda requerido (parámetro "q")', 400);
      }

      console.log(`🔍 Buscando equipos con término: "${q}"`);

      const searchRegex = new RegExp(q.trim(), 'i');
      
      const equipos = await Equipo.find({
        $or: [
          { idEquipo: searchRegex },
          { serial: searchRegex },
          { marca: searchRegex },
          { modelo: searchRegex },
          { tipoEquipo: searchRegex },
          { estado: searchRegex },
          { ubicacion: searchRegex }
        ]
      }).sort({ createdAt: -1 });

      console.log(`✅ Encontrados ${equipos.length} equipos para "${q}"`);

      successResponse(res, {
        equipos,
        total: equipos.length,
        terminoBusqueda: q
      }, `Se encontraron ${equipos.length} equipos para "${q}"`);
      
    } catch (error) {
      console.error('❌ Error en search:', error);
      next(error);
    }
  }

  // 📊 Obtener estadísticas generales
  static async getEstadisticas(req, res, next) {
    try {
      console.log('📊 Obteniendo estadísticas generales...');
      
      const estadisticas = await Equipo.getEstadisticasPorEstado();
      const total = await Equipo.countDocuments();
      
      // Formatear estadísticas
      const stats = {};
      estadisticas.forEach(stat => {
        stats[stat._id] = stat.cantidad;
      });

      const resultado = {
        total,
        porEstado: stats,
        estadisticas
      };

      console.log('✅ Estadísticas obtenidas:', resultado);
      successResponse(res, resultado, 'Estadísticas obtenidas exitosamente');
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      next(error);
    }
  }

  // 🔧 Método para migrar equipos existentes sin idEquipo
  static async migrarIdEquipos(req, res, next) {
    try {
      console.log('🔄 Iniciando migración de idEquipos...');
      
      // Buscar equipos que no tienen idEquipo
      const equiposSinId = await Equipo.find({
        $or: [
          { idEquipo: { $exists: false } },
          { idEquipo: null },
          { idEquipo: '' }
        ]
      });

      console.log(`📊 Encontrados ${equiposSinId.length} equipos sin idEquipo`);

      if (equiposSinId.length === 0) {
        return successResponse(res, { 
          migrados: 0,
          mensaje: 'No hay equipos para migrar' 
        }, 'Todos los equipos ya tienen idEquipo asignado');
      }

      let contador = 0;
      const errores = [];

      for (const equipo of equiposSinId) {
        try {
          // Forzar la generación del idEquipo llamando a save()
          await equipo.save();
          console.log(`✅ Migrado: ${equipo.serial} → ${equipo.idEquipo}`);
          contador++;
        } catch (error) {
          console.error(`❌ Error migrando equipo ${equipo._id}:`, error);
          errores.push({ 
            equipoId: equipo._id, 
            serial: equipo.serial,
            error: error.message 
          });
        }
      }

      const resultado = {
        migrados: contador,
        errores: errores.length,
        detalleErrores: errores,
        mensaje: `Migración completada: ${contador} equipos actualizados`
      };

      console.log('✅ Migración finalizada:', resultado);
      successResponse(res, resultado, `Migración completada: ${contador}/${equiposSinId.length} equipos migrados`);

    } catch (error) {
      console.error('❌ Error en migración:', error);
      next(error);
    }
  }

  // 🗑️ Eliminar equipo (opcional - implementar con cuidado)
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      let equipo;

      // Buscar equipo
      if (id.startsWith('EQ-')) {
        equipo = await Equipo.findOne({ idEquipo: id });
      } else {
        equipo = await Equipo.findById(id);
      }

      if (!equipo) {
        return errorResponse(res, 'Equipo no encontrado', 404);
      }

      // Verificar si tiene asignaciones activas
      const asignacionesActivas = await Asignacion.countDocuments({ 
        equipo: equipo._id,
        fechaDevolucion: null 
      });

      if (asignacionesActivas > 0) {
        return errorResponse(res, 'No se puede eliminar un equipo con asignaciones activas', 400);
      }

      // Eliminar equipo
      await Equipo.findByIdAndDelete(equipo._id);
      
      console.log(`🗑️ Equipo eliminado: ${equipo.idEquipo} - ${equipo.serial}`);
      successResponse(res, { 
        equipoEliminado: {
          idEquipo: equipo.idEquipo,
          serial: equipo.serial
        }
      }, `Equipo ${equipo.idEquipo} eliminado exitosamente`);

    } catch (error) {
      console.error('❌ Error eliminando equipo:', error);
      if (error.name === 'CastError') {
        return errorResponse(res, 'ID de equipo inválido', 400);
      }
      next(error);
    }
  }
}

module.exports = EquipoController;