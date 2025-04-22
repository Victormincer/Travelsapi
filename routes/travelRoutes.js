// routes/travelRoutes.js - Rutas para las operaciones de viajes
const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');
// Crear una nueva ruta de viaje
router.post('/createroute', travelController.createRoute);

// Obtener todas las rutas de viaje
router.get('/getallroutes', travelController.getAllRoutes);

// Obtener una ruta de viaje por su ID
router.get('/getroutebyid/:id', travelController.getRouteById);

// Actualizar una ruta de viaje por su ID
router.patch('/updateroute/:id', travelController.updateRoute);

// Eliminar una ruta de viaje por su ID
router.delete('/deleteroute/:id', travelController.deleteRoute);

// Buscar una ruta por nombre de origen y destino
router.post('/searchbyname', travelController.getRouteByName);

// Buscar una ruta por coordenadas
router.post('/searchbycoordinates', travelController.getRouteByCoordinates);

// Obtener una ruta con información de usuario por ID
router.get('/getroutewithuserinfo/:id', travelController.getRouteWithUserInfo);

// Obtener todas las rutas de un usuario por su ID
router.get('/getroutesbyuserid/:userId', travelController.getRoutesByUserId);

// Obtener estadísticas de rutas de un usuario por su ID
router.get('/getroutestatsbyuserid/:userId', travelController.getRouteStatsByUserId);

module.exports = router;
