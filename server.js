// server.js - Archivo principal para iniciar el servidor
const express = require('express');
const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(express.json({ extended: false }));

// Definir rutas de los usuarios
app.use('/api/users', require('./routes/userRoutes'));
// Definir rutas de los viajes
app.use('/api/travels', require('./routes/travelRoutes'));

// Ruta de prueba
app.get('/', (req, res) => res.send('API funcionando'));

const PORT = process.env.PORT || 8443;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
