// models/Travel.js - Modelo de viaje
const mongoose = require('mongoose');


const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length === 2 &&
               arr.every(coord => typeof coord === 'number');
      },
      message: props => `${props.value} debe ser un array de dos números [longitud, latitud]`
    }
  },
  name: {
    type: String,
    required: [true, 'El nombre del punto es obligatorio']
  }
}, { _id: false }); // No queremos _id para subdocumentos de tipo punto

// Esquema principal para viajes/rutas
const routeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es obligatorio']
  },
  origin: {
    type: pointSchema,
    required: [true, 'El punto de origen es obligatorio']
  },
  destination: {
    type: pointSchema,
    required: [true, 'El punto de destino es obligatorio']
  },
  startTime: {
    type: Date,
    required: [true, 'La hora de inicio es obligatoria']
  },
  endTime: {
    type: Date,
    required: [true, 'La hora de fin es obligatoria'],
    validate: {
      validator: function (value) {
        return this.startTime && value > this.startTime;
      },
      message: 'La hora de fin debe ser posterior a la hora de inicio'
    }
  },
  distance: {
    type: Number,
    required: [true, 'La distancia es obligatoria'],
    min: [0, 'La distancia no puede ser negativa']
  },
  duration: {
    type: Number,
    required: [true, 'La duración es obligatoria'],
    min: [0, 'La duración no puede ser negativa']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Travel', routeSchema);

