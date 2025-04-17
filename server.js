// server.js - Archivo principal para iniciar el servidor
const express = require('express');
const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(express.json({ extended: false }));

// Definir rutas
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba
app.get('/', (req, res) => res.send('API funcionando'));

const PORT = process.env.PORT || 8443;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
