const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pantryItem: {
    item: {
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
    }
  }
});

module.exports = mongoose.model('Pantry', pantrySchema);