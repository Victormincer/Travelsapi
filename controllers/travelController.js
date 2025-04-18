// controllers/travelController.js
const mongoose = require('mongoose');
const Travel = require('../models/Travel');

// Crear una nueva ruta
exports.createRoute = async (req, res) => {
  try {
    const newRoute = new Travel(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las rutas
exports.getAllRoutes = async (_req, res) => {
  try {
    const routes = await Travel.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una ruta por ID
exports.getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de ruta inválido' });
    }

    const route = await Travel.findById(id);
    if (!route) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una ruta por ID
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de ruta inválido' });
    }

    const route = await Travel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!route) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.status(200).json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una ruta por ID
exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de ruta inválido' });
    }

    const route = await Travel.findByIdAndDelete(id);
    if (!route) return res.status(404).json({ message: 'Ruta no encontrada' });

    res.status(200).json({ message: 'Ruta eliminada correctamente', route });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener ruta por nombre de origen y destino
exports.getRouteByName = async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin?.name || !destination?.name) {
      return res.status(400).json({ message: 'Los nombres de origen y destino son obligatorios' });
    }

    const route = await Travel.findOne({
      'origin.name': origin.name,
      'destination.name': destination.name,
    });

    if (!route) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener ruta por coordenadas exactas
exports.getRouteByCoordinates = async (req, res) => {
  try {
    const { originCoordinates, destinationCoordinates } = req.body;

    if (
      !Array.isArray(originCoordinates) || originCoordinates.length !== 2 ||
      !Array.isArray(destinationCoordinates) || destinationCoordinates.length !== 2
    ) {
      return res.status(400).json({ message: 'Coordenadas inválidas: se requieren dos valores [longitud, latitud]' });
    }

    const route = await Travel.findOne({
      'origin.coordinates': originCoordinates,
      'destination.coordinates': destinationCoordinates,
    });

    if (!route) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener ruta con datos de usuario (por ID de ruta)
exports.getRouteWithUserInfo = async (req, res) => {
  try {
    const routeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: 'ID de ruta inválido' });
    }

    const result = await Travel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(routeId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'userDetails.password': 0,
        },
      },
    ]);

    if (!result.length) return res.status(404).json({ message: 'Ruta no encontrada' });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las rutas de un usuario con sus datos
exports.getRoutesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const routes = await Travel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'userDetails.password': 0,
        },
      },
    ]);

    if (!routes.length) return res.status(404).json({ message: 'No se encontraron rutas para este usuario' });
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener estadísticas por usuario
exports.getRouteStatsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const stats = await Travel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$userId',
          totalRoutes: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalTime: { $sum: '$duration' },
          userInfo: { $first: '$userDetails' },
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

    if (!stats.length) {
      return res.status(404).json({
        message: 'No se encontraron rutas para este usuario',
        stats: { totalRoutes: 0, totalDistance: 0, totalTime: 0 },
      });
    }

    res.status(200).json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
