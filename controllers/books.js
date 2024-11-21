const Book = require('../models/book-model');
const { ObjectId } = require('mongodb').ObjectId;

const getBooks = async (req, res) => {
  const { Availability, ISBN } = req.query;

  const filter = {};
  if (Availability) {
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
    const book = await Book.findOne({ BookID: bookId });
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

const createBook = async (req, res) => {
  const book = {
    Title: req.body.Title,
    Author: req.body.Author,
    ISBN: req.body.ISBN,
    Genre: req.body.Genre,
    PublicationYear: req.body.PublicationYear,
    Availability: req.body.Availability,
    Publisher: req.body.Publisher
  };

  const result = await Book.create(book);
  console.log(result);


  if(result._id != null){
    res.status(200).json(book);
  } else {
    res.status(500).json(response.error || "Some error occured while adding the book");
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook
};
