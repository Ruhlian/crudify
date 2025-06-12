// src/config/database.js - Configuración de MongoDB
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./environment');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const conn = await mongoose.connect(MONGODB_URI, options);
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📁 Base de datos: ${conn.connection.name}`);
    
    // Eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB desconectado');
  } catch (error) {
    console.error('❌ Error desconectando MongoDB:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};