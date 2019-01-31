const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  comment: String,
  commentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  gram: {
    type: Schema.Types.ObjectId,
    ref: 'Gram'
  }
});

module.exports = mongoose.model('Comment', commentSchema);
