// server.js - Punto de entrada de la aplicación
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { PORT } = require('./src/config/environment');

// Conectar a la base de datos
connectDB();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 API disponible en: http://localhost:${PORT}/api`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
});

module.exports = server;