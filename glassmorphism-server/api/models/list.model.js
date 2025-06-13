const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    trim: true
  }
});

const List = mongoose.model('List', listSchema);

module.exports = {
  List
}