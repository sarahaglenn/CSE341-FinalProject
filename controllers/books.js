const Book = require('../models/book-model');

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
    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ error: 'No books exist matching the given query parameters.' });
    }
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
  const { BookID, Title, Author, ISBN, Genre, PublicationYear, Availability, Publisher } = req.body;

  // Validate required fields
  if (
    !BookID ||
    !Title ||
    !Author ||
    !ISBN ||
    !PublicationYear ||
    Availability === undefined ||
    !Publisher
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const book = { BookID, Title, Author, ISBN, Genre, PublicationYear, Availability, Publisher };

  try {
    const result = await Book.create(book);
    res.status(200).json(result);
  } catch (error) {
    // console.error('Error creating book:', error.message);
    res
      .status(500)
      .json({ error: 'Some error occurred while adding the book', detail: error.message });
  }
};

const updateBook = async (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);

  if (isNaN(bookId)) {
    return res.status(400).json({ error: 'Invalid bookId. Must be a number.' });
  }

  const updateData = {
    Title: req.body.Title,
    Author: req.body.Author,
    ISBN: req.body.ISBN,
    Genre: req.body.Genre,
    PublicationYear: req.body.PublicationYear,
    Availability: req.body.Availability,
    Publisher: req.body.Publisher
  };

  try {
    const updatedBook = await Book.findOneAndUpdate({ BookID: bookId }, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const deleteBook = async (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);

  if (isNaN(bookId)) {
    return res.status(400).json({ error: 'Invalid bookId. Must be a number.' });
  }

  try {
    const deletedBook = await Book.findOneAndDelete({ BookID: bookId });

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book deleted successfully',
      book: deletedBook
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
