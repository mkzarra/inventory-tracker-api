const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  },
  perishable: {
    type: Boolean,
    required: true,
    expiration: {
      type: Date
    }
  },
  volume: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Item', itemSchema)
