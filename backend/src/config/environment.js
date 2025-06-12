// src/config/environment.js - Configuración de variables de entorno
require('dotenv').config();

const config = {
  // Servidor
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Base de datos
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/crud_db',
  
  // Seguridad
  JWT_SECRET: process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15, // minutos
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100, // requests
  
  // Archivos
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10mb',
  
  // Email (si lo necesitas después)
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

// Validar variables críticas
const requiredVars = ['MONGODB_URI'];
const missingVars = requiredVars.filter(varName => !config[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
  process.exit(1);
}

// Mostrar configuración en desarrollo
if (config.NODE_ENV === 'development') {
  console.log('🔧 Configuración cargada:');
  console.log(`   - Puerto: ${config.PORT}`);
  console.log(`   - Entorno: ${config.NODE_ENV}`);
  console.log(`   - Base de datos: ${config.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
}

module.exports = config;