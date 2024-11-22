const Book = require('../models/book-model');
// const { ObjectId } = require('mongodb').ObjectId;

const getBooks = async (req, res) => {
  const { Availability, ISBN } = req.query;

  const filter = {};

  if (Availability !== undefined) {
    if (Availability !== 'true' && Availability !== 'false') {
      return res
        .status(400)
        .json({ error: 'Invalid value for Availability. Use "true" or "false".' });
    }
    filter.Availability = Availability === 'true';
  }
  if (ISBN) {
    filter.ISBN = ISBN;
  }

  try {
    const books = await Book.find(filter);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const getBookById = async (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);
  if (isNaN(bookId)) {
    return res.status(400).json({ error: 'Invalid BookID. Must be a number.' });
  }
  try {
    const book = await Book.findOne({ BookID: bookId });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'No book exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const createBook = async (req, res) => {
  const book = {
    BookID: req.body.BookID,
    Title: req.body.Title,
    Author: req.body.Author,
    ISBN: req.body.ISBN,
    Genre: req.body.Genre,
    PublicationYear: req.body.PublicationYear,
    Availability: req.body.Availability,
    Publisher: req.body.Publisher
  };

  const result = await Book.create(book);

  if (result._id != null) {
    res.status(200).json(book);
  } else {
    res.status(500).json(response.error || 'Some error occurred while adding the book');
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook
};
