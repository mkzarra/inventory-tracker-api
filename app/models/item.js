const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  },
  expiration: {
    type: Date,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Item', itemSchema);
