const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    trim: true,
    match: /^[a-zA-Z0-9 _-]+$/
  },
  _userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const List = mongoose.model('List', listSchema);

module.exports = {
  List
}