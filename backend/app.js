// src/app.js - Configuración principal de Express
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware básico
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas principales
app.use('/api', routes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;