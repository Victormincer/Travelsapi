// routes/travelRoutes.js - Rutas para las operaciones de viajes
const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// Crear una nueva ruta
router.post('/', travelController.createRoute);

// Obtener todas las rutas
router.get('/', travelController.getAllRoutes);

// Obtener una ruta por ID
router.get('/id/:id', travelController.getRouteById);

// Actualizar una ruta por ID
router.patch('/:id', travelController.updateRoute);

// Eliminar una ruta por ID
router.delete('/:id', travelController.deleteRoute);

// Buscar ruta por nombre de origen y destino
router.post('/search/name', travelController.getRouteByName);

// Buscar ruta por coordenadas
router.post('/search/coordinates', travelController.getRouteByCoordinates);

// Obtener una ruta con información de usuario por ID
router.get('/:id/with-user', travelController.getRouteWithUserInfo);

// Obtener todas las rutas de un usuario por su ID
router.get('/user/:userId/routes', travelController.getRoutesByUserId);

// Obtener estadísticas de rutas de un usuario por su ID
router.get('/user/:userId/stats', travelController.getRouteStatsByUserId);

module.exports = router;
