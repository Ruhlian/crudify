// src/models/User.js - Modelo de Usuario
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  edad: {
    type: Number,
    min: [0, 'La edad no puede ser negativa'],
    max: [120, 'La edad no puede ser mayor a 120 años'],
    validate: {
      validator: Number.isInteger,
      message: 'La edad debe ser un número entero'
    }
  },
  telefono: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Por favor ingresa un número de teléfono válido'
    }
  },
  activo: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  direccion: {
    calle: String,
    ciudad: String,
    codigoPostal: String,
    pais: {
      type: String,
      default: 'Colombia'
    }
  },
  preferencias: {
    tema: {
      type: String,
      enum: ['claro', 'oscuro', 'auto'],
      default: 'auto'
    },
    idioma: {
      type: String,
      enum: ['es', 'en', 'fr'],
      default: 'es'
    },
    notificaciones: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para mejorar performance
userSchema.index({ email: 1 });
userSchema.index({ activo: 1 });
userSchema.index({ createdAt: -1 });

// Middleware pre-save
userSchema.pre('save', function(next) {
  // Capitalizar nombre
  if (this.isModified('nombre')) {
    this.nombre = this.nombre
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  next();
});

// Métodos virtuales
userSchema.virtual('nombreCompleto').get(function() {
  return this.nombre;
});

userSchema.virtual('esAdulto').get(function() {
  return this.edad && this.edad >= 18;
});

// Método para formato JSON personalizado
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  
  // Remover campos sensibles en respuestas
  delete userObject.__v;
  
  return userObject;
};

// Métodos estáticos
userSchema.statics.findActivos = function() {
  return this.find({ activo: true });
};

userSchema.statics.buscarPorEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.contarPorEdad = function(edadMin, edadMax) {
  return this.countDocuments({
    edad: { $gte: edadMin, $lte: edadMax },
    activo: true
  });
};

// Métodos de instancia
userSchema.methods.desactivar = function() {
  this.activo = false;
  return this.save();
};

userSchema.methods.activar = function() {
  this.activo = true;
  return this.save();
};

userSchema.methods.actualizarUltimaActividad = function() {
  this.updatedAt = new Date();
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;