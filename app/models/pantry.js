const mongoose = require('mongoose')

const pantrySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    item_id: {
      type: mongoose.Schema.type.ObjectId,
      ref: 'Item',
      require: true
    },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    storage: {
      type: ['refrigerator', 'freezer', 'cabinet'],
      required: true
    }
  }]
})