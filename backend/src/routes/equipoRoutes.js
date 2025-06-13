const express = require('express');
const EquipoController = require('../controllers/equipoController');
const router = express.Router();

// Rutas para equipos
router.get('/', EquipoController.getAll);
router.get('/:id', EquipoController.getById);
router.post('/', EquipoController.create);
router.put('/:id', EquipoController.update);

// Rutas específicas para estados
router.get('/estado/:estado', EquipoController.getEquiposPorEstado);
router.get('/:id/historial', EquipoController.getHistorialAsignaciones);

module.exports = router;