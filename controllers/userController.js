// controllers/userController.js - Controlador para operaciones de usuario
const User = require('../models/User');
const crypto = require('crypto'); 

// Función para hashear una contraseña usando SHA-1
function hashPassword(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
}
//Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//Obtener usuario por Id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//Crear usuario
exports.createUser = async (req, res) => {
    const { email, username, password, deviceInfo } = req.body;
    try {
        const hashedPassword = hashPassword(password);
        const newUser = new User({
            email,
            username,
            password: hashedPassword,    
            deviceInfo,
        });
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Autenticar usuario
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = hashPassword(password);
        if (hashedPassword !== user.password) return res.status(400).json({ message: 'Invalid credentials' }); 
        
        user.lastLogin = new Date();
        await user.save();
       
        const userInfo = {
            id: user._id,
            email: user.email,
            username: user.username, 
            createdAt: user.createdAt,
            deviceInfo: user.deviceInfo, 
        };
        res.status(200).json(userInfo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//Obtener usuario por email
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }); 
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userInfo = {
            id: user._id,
            email: user.email,
            username: user.username, 
            createdAt: user.createdAt,
            deviceInfo: user.deviceInfo, 
        };
        res.status(200).json(userInfo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Actualizar usuario por email
exports.updateEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'required a new email' });
    }
    
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
        if (emailExists) {
            return res.status(400).json({ message: 'The email already exists' });
        }

        user.email = email;
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID invalid' });
        }
        res.status(500).json({ message: err.message });
    }
};
//Actualizar fecha de ultima conexión
exports.updateLastLogin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.lastLogin = Date.now();
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'ID invalid' });
        }
        res.status(500).json({ message: err.message });
    }
};
