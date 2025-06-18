const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  idEquipo: {
    type: String,
    unique: true,
    // No requerido porque se genera automáticamente
  },
  serial: {
    type: String,
    required: [true, 'El serial es requerido'],
    unique: true,
    trim: true,
    uppercase: true
  },
  marca: {
    type: String,
    required: [true, 'La marca es requerida'],
    trim: true
  },
  modelo: {
    type: String,
    required: [true, 'El modelo es requerido'],
    trim: true
  },
  tipoEquipo: {
    type: String,
    required: [true, 'El tipo de equipo es requerido'],
    enum: ['Laptop', 'Desktop', 'Monitor', 'Impresora', 'Telefono', 'Tablet', 'Servidor', 'Router', 'Switch', 'Otro']
  },
  estado: {
    type: String,
    required: [true, 'El estado es requerido'],
    enum: ['Bodega', 'Asignado', 'Reposo', 'Alistamiento', 'Mantenimiento', 'Baja'],
    default: 'Bodega'
  },
  ubicacion: {
    type: String,
    trim: true,
    default: 'Bodega Principal'
  },
  observaciones: {
    type: String,
    trim: true
  },
  // Campos de seguimiento
  fechaAdquisicion: {
    type: Date
  },
  valorCompra: {
    type: Number,
    min: 0
  },
  proveedor: {
    type: String,
    trim: true
  },
  garantia: {
    fechaVencimiento: Date,
    estado: {
      type: String,
      enum: ['Vigente', 'Vencida', 'No aplica'],
      default: 'No aplica'
    }
  },
  especificaciones: {
    procesador: String,
    memoria: String,
    almacenamiento: String,
    sistemaOperativo: String,
    otros: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// =========================================
// ÍNDICES PARA OPTIMIZAR BÚSQUEDAS
// =========================================
equipoSchema.index({ idEquipo: 1 });
equipoSchema.index({ serial: 1 });
equipoSchema.index({ estado: 1 });
equipoSchema.index({ tipoEquipo: 1 });
equipoSchema.index({ marca: 1, modelo: 1 });

// =========================================
// MIDDLEWARE PRE-SAVE PARA GENERAR idEquipo
// =========================================
equipoSchema.pre('save', async function(next) {
  // Solo generar idEquipo si es un documento nuevo Y no tiene idEquipo
  if (this.isNew && !this.idEquipo) {
    try {
      const nuevoIdEquipo = await generarSiguienteIdEquipo();
      this.idEquipo = nuevoIdEquipo;
      console.log(`🆔 ID generado automáticamente: ${nuevoIdEquipo}`);
    } catch (error) {
      console.error('❌ Error generando idEquipo:', error);
      return next(error);
    }
  }
  next();
});

// =========================================
// FUNCIÓN PARA GENERAR EL SIGUIENTE ID
// =========================================
async function generarSiguienteIdEquipo() {
  const Equipo = mongoose.model('Equipo');
  
  // Buscar el último equipo por idEquipo de forma más eficiente
  const ultimoEquipo = await Equipo.findOne(
    { idEquipo: { $regex: /^EQ-\d{4}$/ } },
    { idEquipo: 1 },
    { sort: { idEquipo: -1 } }
  );

  let numeroSiguiente = 1;

  if (ultimoEquipo && ultimoEquipo.idEquipo) {
    // Extraer el número del formato EQ-XXXX
    const match = ultimoEquipo.idEquipo.match(/^EQ-(\d{4})$/);
    if (match) {
      numeroSiguiente = parseInt(match[1], 10) + 1;
    }
  }

  // Formatear con 4 dígitos (EQ-0001, EQ-0002, etc.)
  const nuevoId = `EQ-${numeroSiguiente.toString().padStart(4, '0')}`;
  
  // 🛡️ Verificación de seguridad: asegurarse de que no existe
  const existeId = await Equipo.findOne({ idEquipo: nuevoId });
  if (existeId) {
    console.warn(`⚠️ ID ${nuevoId} ya existe, buscando siguiente...`);
    // Si por alguna razón ya existe, intentar con el siguiente
    return generarSiguienteIdEquipo();
  }

  return nuevoId;
}

// =========================================
// MÉTODOS ESTÁTICOS PERSONALIZADOS
// =========================================

// Buscar por idEquipo
equipoSchema.statics.findByIdEquipo = function(idEquipo) {
  return this.findOne({ idEquipo });
};

// Buscar por serial
equipoSchema.statics.findBySerial = function(serial) {
  return this.findOne({ serial: serial.toUpperCase() });
};

// Obtener estadísticas por estado
equipoSchema.statics.getEstadisticasPorEstado = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$estado',
        cantidad: { $sum: 1 }
      }
    },
    {
      $sort: { cantidad: -1 }
    }
  ]);
};

// Buscar equipos disponibles (Bodega, Reposo, Alistamiento)
equipoSchema.statics.findDisponibles = function() {
  return this.find({
    estado: { $in: ['Bodega', 'Reposo', 'Alistamiento'] }
  }).sort({ createdAt: -1 });
};

// =========================================
// MÉTODOS DE INSTANCIA
// =========================================

// Cambiar estado del equipo
equipoSchema.methods.cambiarEstado = function(nuevoEstado, observaciones = null) {
  this.estado = nuevoEstado;
  if (observaciones) {
    this.observaciones = observaciones;
  }
  return this.save();
};

// Verificar si está disponible para asignación
equipoSchema.methods.estaDisponible = function() {
  return ['Bodega', 'Reposo', 'Alistamiento'].includes(this.estado);
};

// =========================================
// VIRTUALS
// =========================================

// Edad del equipo (si tiene fecha de adquisición)
equipoSchema.virtual('edadEnDias').get(function() {
  if (this.fechaAdquisicion) {
    const hoy = new Date();
    const diferencia = hoy - this.fechaAdquisicion;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Estado de la garantía
equipoSchema.virtual('estadoGarantia').get(function() {
  if (!this.garantia || !this.garantia.fechaVencimiento) {
    return 'Sin información';
  }
  
  const hoy = new Date();
  if (this.garantia.fechaVencimiento > hoy) {
    return 'Vigente';
  } else {
    return 'Vencida';
  }
});

// =========================================
// MIDDLEWARE POST-SAVE PARA LOGS
// =========================================
equipoSchema.post('save', function(doc) {
  console.log(`✅ Equipo guardado: ${doc.idEquipo} - ${doc.serial} - ${doc.estado}`);
});

// =========================================
// VALIDACIONES PERSONALIZADAS
// =========================================

// Validar formato de serial (opcional, ajustar según tus necesidades)
equipoSchema.path('serial').validate(function(serial) {
  // Ejemplo: serial debe tener al menos 3 caracteres
  return serial && serial.length >= 3;
}, 'El serial debe tener al menos 3 caracteres');

// Validar que la fecha de adquisición no sea futura
equipoSchema.path('fechaAdquisicion').validate(function(fecha) {
  if (!fecha) return true; // Campo opcional
  return fecha <= new Date();
}, 'La fecha de adquisición no puede ser futura');

module.exports = mongoose.model('Equipo', equipoSchema);