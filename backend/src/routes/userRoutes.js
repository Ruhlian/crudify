// src/routes/userRoutes.js - Rutas de Usuario
const express = require('express');
const UserController = require('../controllers/userController');
const { validateUser, validateUserId } = require('../middleware/validation');

const router = express.Router();

// Rutas de usuarios
router.route('/')
  .get(UserController.getAllUsers)           // GET /api/users
  .post(validateUser, UserController.createUser); // POST /api/users

router.route('/stats')
  .get(UserController.getUserStats);         // GET /api/users/stats

router.route('/:id')
  .get(validateUserId, UserController.getUserById)        // GET /api/users/:id
  .put(validateUserId, validateUser, UserController.updateUser) // PUT /api/users/:id
  .delete(validateUserId, UserController.deleteUser);     // DELETE /api/users/:id

router.route('/:id/permanent')
  .delete(validateUserId, UserController.deleteUserPermanent); // DELETE /api/users/:id/permanent

router.route('/:id/reactivate')
  .patch(validateUserId, UserController.reactivateUser);  // PATCH /api/users/:id/reactivate

module.exports = router;