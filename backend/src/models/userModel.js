const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  idUsuario: {
    type: String,
    required: [true, 'El ID de usuario es obligatorio'],
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    select: false,
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
  },
  cargo: {
    type: String,
    required: [true, 'El cargo es obligatorio'],
    enum: {
      values: ['Empleado', 'Supervisor', 'Gerente', 'Administrador'],
      message: 'Cargo no válido'
    }
  },
  sede: {
    type: String,
    required: [true, 'La sede es obligatoria']
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria']
  },
  gerencia: {
    type: String,
    required: [true, 'La gerencia es obligatoria']
  },
  activo: {
    type: Boolean,
    default: true
  },
  rol: {
    type: String,
    enum: ['user', 'admin', 'tecnico'],
    default: 'user'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: Date
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para obtener equipos asignados
userSchema.virtual('equiposAsignados', {
  ref: 'Asignacion',
  localField: '_id',
  foreignField: 'usuario',
  justOne: false,
  match: { activo: true }
});

// Middleware para hash de contraseña
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para desactivar usuario
userSchema.methods.desactivar = function() {
  this.activo = false;
  return this.save();
};

// Query helper para usuarios activos
userSchema.query.activos = function() {
  return this.where({ activo: true });
};

const User = mongoose.model('User', userSchema);

module.exports = User;