// server.js - Archivo principal para iniciar el servidor
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno desde .env (solo en desarrollo)
dotenv.config();

// Conectar a la base de datos MongoDB
connectDB();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/travels', require('./routes/travelRoutes'));

// Ruta base
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Puerto proporcionado por Azure o por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
