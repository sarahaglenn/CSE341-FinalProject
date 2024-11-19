const Book = require('../models/book-model');
const { ObjectId } = require('mongodb');

const getBooks = async (req, res) => {
  const { availability, ISBN } = req.query;

  const filter = {};
  if (availability) {
    filter.availability = availability.toLowerCase() === 'true';
  }
    if (ISBN) {
        filter.isbn = ISBN;
  }

  try {
    const books = await Book.find(filter);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving books', detail: error.message });
  }
};

const getBookById = async (req, res) => {
  // It doesn't look like we plan to retrieve books by their generated id, so this can be
  // removed along with the response in swagger.json

  //   if (!ObjectId.isValid(req.params.id)) {
  //     return res.status(400).json({ error: 'Must use a valid book id to find a book.' });
  //   }
  const bookId = req.params.bookId;
  try {
    const book = await Book.find({ bookId: bookId });
    if (book) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'No book exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving book.', detail: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById
};
