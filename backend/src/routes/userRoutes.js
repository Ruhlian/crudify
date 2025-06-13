const express = require('express');
const UserController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

router.route('/')
  .get(authorize('admin', 'tecnico'), UserController.getAllUsers)
  .post(authorize('admin'), UserController.createUser);

router.route('/:id')
  .get(UserController.getUserById)
  .put(UserController.updateUser)
  .delete(authorize('admin'), UserController.deactivateUser);

router.get('/:id/equipos', UserController.getUserEquipment);
router.get('/estadisticas/usuarios', authorize('admin'), UserController.getUserStats);

module.exports = router;