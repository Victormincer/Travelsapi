// routes/travelRoutes.js - Rutas para las operaciones de viajes
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Crear una nueva ruta
router.post('/', routeController.createRoute);

// Obtener todas las rutas
router.get('/', routeController.getAllRoutes);

// Obtener ruta por ID
router.get('/id/:id', routeController.getRouteById);

// Actualizar una ruta
router.patch('/:id', routeController.updateRoute);

// Eliminar una ruta
router.delete('/:id', routeController.deleteRoute);

// Buscar ruta por nombre de origen y destino
router.post('/nameroute', routeController.getRouteByName);

// Buscar ruta por coordenadas
router.post('/coordinates', routeController.getRouteByCoordinates);

// Obtener ruta con información de usuario por ID de ruta
router.get('/route/:id/withuser', routeController.getRouteWithUserInfo);

// Obtener rutas de un usuario por su email
router.get('/user/:email/routes', routeController.getRoutesByUserEmail);

// Obtener estadísticas de rutas de un usuario por email
router.get('/stats/user/:email', routeController.getRouteStatsByEmail);


module.exports = router;
