const express = require('express');
const userRoutes = require('./userRoutes');
const equipoRoutes = require('./equipoRoutes');
const asignacionRoutes = require('./asignacionRoutes');
const { authenticate } = require('../middleware/auth');
const authRoutes = require('./authRoutes');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Sistema
 *     description: Endpoints generales del sistema
 *   - name: Usuarios
 *     description: Gestión de usuarios del sistema
 *   - name: Equipos
 *     description: Gestión de equipos tecnológicos
 *   - name: Asignaciones
 *     description: Gestión de asignación de equipos
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica el estado del API
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Sistema de gestión de equipos funcionando',
    timestamp: new Date().toISOString()
  });
});

// Aplicar autenticación a todas las rutas excepto /health
router.use((req, res, next) => {
  if (req.path === '/health') return next();
  authenticate(req, res, next);
});

// Rutas principales con documentación Swagger
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener lista de usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 */
router.use('/users', userRoutes);

/**
 * @swagger
 * /equipos:
 *   get:
 *     summary: Obtener lista de equipos
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 */
router.use('/equipos', equipoRoutes);

/**
 * @swagger
 * /asignaciones:
 *   get:
 *     summary: Obtener lista de asignaciones
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 */
router.use('/asignaciones', asignacionRoutes);

// Manejo de rutas no encontradas
/**
 * @swagger
 * /*:
 *   get:
 *     summary: Ruta no encontrada
 *     responses:
 *       404:
 *         description: Endpoint no existe
 */
router.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado',
    sugerencia: `Verifique la documentación en ${req.protocol}://${req.get('host')}/docs`,
    endpoints_disponibles: [
      '/health',
      '/users',
      '/equipos',
      '/asignaciones'
    ]
  });
});

router.use('/auth', authRoutes);

module.exports = router;