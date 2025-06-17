const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Proteger todas las rutas
router.use(AuthController.protect);

// Rutas públicas para usuarios autenticados
router.route('/')
  .get(UserController.getAllUsers)
  .post(AuthController.restrictTo('admin'), UserController.createUser);

router.get('/stats', AuthController.restrictTo('admin', 'tecnico'), UserController.getUserStats);

router.route('/:id')
  .get(UserController.getUserById)
  .patch(AuthController.restrictTo('admin'), UserController.updateUser)
  .delete(AuthController.restrictTo('admin'), UserController.deactivateUser);

router.get('/:id/equipment', UserController.getUserEquipment);

module.exports = router;