// config/db.js - Conexión a MongoDB usando variable de entorno

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('La variable de entorno MONGO_URI no está definida.');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión MongoDB: ${error.message}`);
    process.exit(1); // Detiene la app si falla la conexión
  }
};

module.exports = connectDB;