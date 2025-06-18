const express = require('express');
const EquipoController = require('../controllers/equipoController');
const { protect } = require('../middleware/auth'); // Si tienes autenticación

const router = express.Router();

// 🔍 Rutas de búsqueda (ANTES de las rutas con parámetros)
router.get('/search', EquipoController.search);

// 🔄 Ruta para migrar equipos sin idEquipo (solo para desarrollo/admin)
router.post('/migrar-ids', EquipoController.migrarIdEquipos);

// 📊 Rutas principales
router.route('/')
  .get(EquipoController.getAll)
  .post(EquipoController.create);

// 🏷️ Buscar por serial específico
router.get('/serial/:serial', EquipoController.getBySerial);

// 📈 Equipos por estado
router.get('/estado/:estado', EquipoController.getEquiposPorEstado);

// 📋 Rutas con parámetro ID (al final para evitar conflictos)
router.route('/:id')
  .get(EquipoController.getById)
  .put(EquipoController.update);

// 📚 Historial de asignaciones
router.get('/:equipoId/historial', EquipoController.getHistorialAsignaciones);

module.exports = router;