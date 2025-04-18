// routes/userRoutes.js - Rutas para las operaciones de usuario
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta GET /api/users
router.get('/getallusers', userController.getUsers);

// Ruta GET /api/users/:id
router.get('/:id', userController.getUserById);

// Ruta POST /api/users
router.post('/createuser', userController.createUser);

// Ruta PUT /api/users/:id
router.put('/:id', userController.updateUser);

// Ruta DELETE /api/users/:id
router.delete('/:id', userController.deleteUser);

// Ruta LOGIN /api/users/login
router.post('/login', userController.loginUser);

// ruta GET /api/users/email/:email
router.get('/email/:email', userController.getUserByEmail);

//ruta PUT /api/users/:id/email
router.put('/:id/email', userController.updateEmail);

// Ruta PUT /api/users/:id/lastlogin
router.put('/:id/lastlogin', userController.updateLastLogin);

module.exports = router;
