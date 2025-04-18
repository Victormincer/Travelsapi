
// models/Travel.js - Modelo de viaje
const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length === 2;
      },
      message: props => `${props.value} debe tener exactamente dos coordenadas [longitud, latitud]`
    }
  },
  name: {
    type: String,
    required: true
  }
});

const routeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  origin: {
    type: pointSchema,
    required: true
  },
  destination: {
    type: pointSchema,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return this.startTime && value > this.startTime;
      },
      message: 'endTime debe ser posterior a startTime'
    }
  },
  distance: {
    type: Number,
    required: true,
    min: [0, 'La distancia no puede ser negativa']
  },
  duration: {
    type: Number,
    required: true,
    min: [0, 'La duración no puede ser negativa']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Travel', routeSchema);
