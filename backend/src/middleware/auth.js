// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const Token = require('../models/tokenModel');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
    try {
      console.log('🔑 Middleware auth - Headers:', req.headers); // 1.1
  
      const token = req.headers.authorization?.split(' ')[1];
      console.log('🛡️ Token recibido:', token ? token.slice(0, 10) + '...' : 'NO PROVISTO'); // 1.2
  
      if (!token) {
        console.log('❌ No se proporcionó token');
        return errorResponse(res, 'Token requerido', 401);
      }
  
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('👤 Usuario decodificado:', decoded); // 2.1
  
      // Verificar en DB
      const tokenDoc = await Token.findOne({ token });
      console.log('📦 Token en DB:', tokenDoc ? 'VÁLIDO' : 'NO ENCONTRADO/INVÁLIDO'); // 3.1
  
      if (!tokenDoc) {
        console.log('❌ Token no existe en DB');
        return errorResponse(res, 'Token inválido', 401);
      }
  
      req.user = decoded;
      console.log('➡️ Autenticación exitosa para usuario ID:', decoded.id); // 4.1
      next();
  
    } catch (error) {
      console.error('⛔ Error en middleware auth:', error.name, error.message); // 5.1
      errorResponse(res, 'Token inválido', 401);
    }
  };

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Acceso denegado - No tienes permisos suficientes', 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};