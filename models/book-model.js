const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  BookID: {
    type: Number,
    //required: true, This cannot be required because then we have to manually insert it. 
    unique: true
  },
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
    required: false,
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
  Publisher: {
    type: String,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema, 'Books');

module.exports = Book;
