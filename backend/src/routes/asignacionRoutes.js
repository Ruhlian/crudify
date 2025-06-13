const express = require('express');
const AsignacionController = require('../controllers/asignacionController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Asignaciones
 *   description: Gestión de asignación de equipos a usuarios
 */

/**
 * @swagger
 * /asignaciones:
 *   post:
 *     summary: Crear una nueva asignación
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asignacion'
 *     responses:
 *       201:
 *         description: Asignación creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 */
router.post('/', authorize('admin', 'tecnico'), AsignacionController.crear);

/**
 * @swagger
 * /asignaciones:
 *   get:
 *     summary: Obtener todas las asignaciones
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por asignaciones activas/inactivas
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *       401:
 *         description: No autorizado
 */
router.get('/', authorize('admin', 'tecnico'), AsignacionController.obtenerTodas);

/**
 * @swagger
 * /asignaciones/{id}:
 *   get:
 *     summary: Obtener una asignación por ID
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Detalles de la asignación
 *       404:
 *         description: Asignación no encontrada
 *       401:
 *         description: No autorizado
 */
router.get('/:id', authorize('admin', 'tecnico'), AsignacionController.obtenerPorId);

/**
 * @swagger
 * /asignaciones/{id}:
 *   put:
 *     summary: Finalizar una asignación
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Asignación finalizada correctamente
 *       404:
 *         description: Asignación no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 */
router.put('/:id', authorize('admin', 'tecnico'), AsignacionController.finalizar);

/**
 * @swagger
 * /asignaciones/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener asignaciones por usuario
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de asignaciones del usuario
 *       400:
 *         description: ID de usuario inválido
 *       401:
 *         description: No autorizado
 */
router.get('/usuario/:usuarioId', authorize('admin', 'tecnico'), AsignacionController.porUsuario);

/**
 * @swagger
 * /asignaciones/equipo/{equipoId}:
 *   get:
 *     summary: Obtener historial de asignaciones de un equipo
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del equipo
 *     responses:
 *       200:
 *         description: Historial de asignaciones del equipo
 *       400:
 *         description: ID de equipo inválido
 *       401:
 *         description: No autorizado
 */
router.get('/equipo/:equipoId', authorize('admin', 'tecnico'), AsignacionController.historialEquipo);

module.exports = router;