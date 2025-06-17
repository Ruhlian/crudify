const express = require('express');
const router = express.Router();

// 1. Importar todas las rutas
const userRoutes = require('./userRoutes');
const equipoRoutes = require('./equipoRoutes');
const asignacionRoutes = require('./asignacionRoutes');
const authRoutes = require('./authRoutes');
const { authenticate } = require('../middleware/auth');

// 2. Rutas PÚBLICAS (no requieren autenticación)
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});

router.use('/auth', authRoutes); // Rutas de autenticación

// 3. Middleware de autenticación (se aplica a todas las rutas siguientes)
router.use(authenticate);

// 4. Rutas PRIVADAS (requieren autenticación)
router.use('/users', userRoutes);
router.use('/equipos', equipoRoutes);
router.use('/asignaciones', asignacionRoutes);

// 5. Manejo de rutas no encontradas (siempre al final)
router.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = router;