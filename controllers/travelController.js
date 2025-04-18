// controllers/travelController.js - Controlador para operaciones de viajes
const mongoose = require('mongoose');
const Route = require('../models/Travel');

// Crear una nueva ruta
exports.createRoute = async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las rutas
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una ruta por ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json(route);
  } catch (error) {
    res.status(400).json({ message: 'Invalid route ID' });
  }
};

// Actualizar una ruta por ID
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una ruta por ID
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ message: 'Route deleted successfully', route });
  } catch (error) {
    res.status(400).json({ message: 'Invalid route ID' });
  }
};

// Obtener ruta por nombre de origen y destino
exports.getRouteByName = async (req, res) => {
  try {
    const { origin, destination } = req.body;
    if (!origin?.name || !destination?.name) {
      return res.status(400).json({ message: "Origin and destination names are required" });
    }

    const route = await Route.findOne({
      "origin.name": origin.name,
      "destination.name": destination.name,
    });

    if (!route) return res.status(404).json({ message: "Route not found" });
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener ruta por coordenadas
exports.getRouteByCoordinates = async (req, res) => {
  try {
    const { originCoordinates, destinationCoordinates } = req.body;
    if (!originCoordinates || !destinationCoordinates) {
      return res.status(400).json({ message: "Coordinates are required" });
    }

    const route = await Route.findOne({
      "origin.coordinates": originCoordinates,
      "destination.coordinates": destinationCoordinates,
    });

    if (!route) return res.status(404).json({ message: "Route not found" });
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener ruta con información de usuario por ID de ruta
exports.getRouteWithUserInfo = async (req, res) => {
  try {
    const routeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: "Invalid route ID format" });
    }

    const result = await Route.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(routeId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "userDetails.password": 0,
        },
      },
    ]);

    if (!result.length) return res.status(404).json({ message: "Route not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener rutas con usuarios por ID de usuario
exports.getRoutesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const routes = await Route.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "userDetails.password": 0,
        },
      },
    ]);

    if (!routes.length) return res.status(404).json({ message: "No routes found for this user" });
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener estadísticas de rutas por ID de usuario
exports.getRouteStatsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await Route.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$userId",
          totalRoutes: { $sum: 1 },
          totalDistance: { $sum: "$distance" },
          totalTime: { $sum: "$duration" },
          userInfo: { $first: "$userDetails" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRoutes: 1,
          totalDistance: 1,
          totalTime: 1,
          userInfo: { password: 0 },
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        message: "No routes found for this user",
        stats: { totalRoutes: 0, totalDistance: 0, totalTime: 0 },
      });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
