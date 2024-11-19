const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  Title: {
    type: String,
    required: true
  },
  Author: {
    type: String,
    required: true
  },
  ISBN: {
    type: String,
    required: true
  },
  Genre: {
    type: String,
    default: null
  },
  PublicationYear: {
    type: Number,
    required: true
  },
  Availability: {
    type: Boolean,
    required: true
  },
  BookID: {
    type: Number,
    required: true
  },
  Publisher: {
    type: String,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
