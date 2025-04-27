// routes/userRoutes.js - Rutas para las operaciones de usuario
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/// Obtener todos los usuarios
router.get('/getallusers', userController.getUsers);

// Obtener un usuario por su ID
router.get('/getuserbyid/:id', userController.getUserById);

// Crear un nuevo usuario
router.post('/createuser', userController.createUser);
// Actualizar datos de un usuario por su ID
router.put('/updateuser/:id', userController.updateUser);

// Eliminar un usuario por su ID
router.delete('/deleteuser/:id', userController.deleteUser);

// Iniciar sesión de usuario
router.post('/loginuser', userController.loginUser);

// Obtener un usuario por su correo electrónico
router.get('/getuserbyemail/:email', userController.getUserByEmail);

// Actualizar el correo electrónico de un usuario por su ID
router.put('/updateemail/:id', userController.updateEmail);

// Actualizar la última fecha de inicio de sesión de un usuario por su ID
router.put('/updatelastlogin/:id', userController.updateLastLogin);

module.exports = router;
