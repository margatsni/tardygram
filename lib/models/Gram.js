const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gramSchema = new mongoose.Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'User'
    // required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  caption: String,
  tags: [{
    type: String,
  }]
});

module.exports = mongoose.model('Gram', gramSchema);
