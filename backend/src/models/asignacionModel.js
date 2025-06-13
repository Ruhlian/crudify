const mongoose = require('mongoose');

const asignacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  accesorios: {
    cargadorLaptop: Boolean,
    dockingStation: Boolean,
    cargadorDocking: Boolean,
    monitor: Boolean,
    maleta: Boolean,
    guayaAdaptador: Boolean
  },
  fechaAsignacion: {
    type: Date,
    default: Date.now
  },
  fechaDevolucion: Date,
  motivoDevolucion: String,
  activo: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('Asignacion', asignacionSchema);