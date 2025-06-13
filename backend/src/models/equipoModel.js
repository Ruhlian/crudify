const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  tipoEquipo: {
    type: String,
    required: true,
    enum: ['Laptop', 'Desktop', 'Monitor', 'Tablet', 'Otro']
  },
  marca: String,
  modelo: String,
  serial: {
    type: String,
    required: true,
    unique: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['Asignado', 'Bodega', 'Reposo', 'Alistamiento', 'Mantenimiento', 'Baja'],
    default: 'Bodega'
  },
  tipoContrato: {
    type: String,
    enum: ['Arrendamiento', 'Propio', 'Comodato', null]
  },
  estadoActa: {
    type: String,
    enum: ['Firmada', 'Pendiente', 'No aplica', null]
  },
  fechaEntrega: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Equipo', equipoSchema);