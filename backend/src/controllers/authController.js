const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Asegúrate de tener tu modelo de usuario
const { successResponse, errorResponse } = require('../utils/response');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // 2. Validar contraseña (asumiendo que tienes un método comparePassword en el modelo)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    // 3. Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role // Asegúrate de que coincida con el campo en tu modelo
      }, 
      process.env.JWT_SECRET, // <- ¡Debe ser igual que en auth.js!
      { expiresIn: '1h' }
    );

    // 4. Responder con el token
    successResponse(res, { token }, 200, 'Login exitoso');

  } catch (error) {
    errorResponse(res, 'Error en el servidor', 500, error.message);
  }
};