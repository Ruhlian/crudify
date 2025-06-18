// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const equipoRoutes = require('./src/routes/equipoRoutes');

// Middleware de manejo de errores
const globalErrorHandler = require('./src/middleware/errorHandler');

// Inicializar app
const app = express();

// ✅ CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5001',
    'http://127.0.0.1:5001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(helmet());
app.use(cors(corsOptions));

// ✅ Limitadores
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Demasiados intentos de login, intenta nuevamente en 15 minutos.'
  }
});

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/equipos', equipoRoutes);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Conexión MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ✅ Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ❌ Ruta 404
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `No se puede encontrar ${req.originalUrl} en este servidor`
  });
});

// ✅ Manejo de errores global
app.use(globalErrorHandler);

// Variables obligatorias
const requiredEnvVars = ['NODE_ENV', 'PORT', 'MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

const checkEnvVars = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missing.join(', '));
    process.exit(1);
  }
};

// 🟢 Iniciar servidor
const startServer = async () => {
  try {
    checkEnvVars();
    await connectDB();

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Errores no capturados
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Cerrando servidor...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Cerrando servidor...');
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();
