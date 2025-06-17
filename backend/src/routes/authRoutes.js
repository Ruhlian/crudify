const express = require('express');
const AuthController = require('../controllers/authController');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validation');

const router = express.Router();

// Validaciones
const registerValidation = [
  body('idUsuario')
    .notEmpty()
    .withMessage('El ID de usuario es obligatorio')
    .isLength({ min: 3, max: 20 })
    .withMessage('El ID de usuario debe tener entre 3 y 20 caracteres'),
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder los 100 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  body('cargo')
    .notEmpty()
    .withMessage('El cargo es obligatorio')
    .isIn(['Empleado', 'Supervisor', 'Gerente', 'Administrador'])
    .withMessage('Cargo no válido'),
  body('sede')
    .notEmpty()
    .withMessage('La sede es obligatoria'),
  body('direccion')
    .notEmpty()
    .withMessage('La dirección es obligatoria'),
  body('gerencia')
    .notEmpty()
    .withMessage('La gerencia es obligatoria')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

// Rutas públicas
router.post('/register', registerValidation, validationMiddleware, AuthController.register);
router.post('/login', loginValidation, validationMiddleware, AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/verify-token', AuthController.verifyToken);

// Rutas protegidas
router.use(AuthController.protect);

router.get('/me', AuthController.getMe);

module.exports = router;
