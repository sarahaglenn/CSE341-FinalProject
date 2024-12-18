const request = require('supertest');
const express = require('express');
const {
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  createBook
} = require('../controllers/books');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

// Mock the Mongoose Book model
jest.mock('../models/book-model', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  create: jest.fn()
}));

const Book = require('../models/book-model');

// Set up Express apps for each route
const appForBooks = express();
appForBooks.use(express.json());
appForBooks.get('/books', getBooks);

const appForBookById = express();
appForBookById.use(express.json());
appForBookById.get('/books/:bookId', getBookById);

const appForUpdateBook = express();
appForUpdateBook.use(express.json());
appForUpdateBook.put('/books/:bookId', updateBook);

const appForDeleteBook = express();
appForDeleteBook.use(express.json());
appForDeleteBook.delete('/books/:bookId', deleteBook);

const appForCreateBook = express();
appForCreateBook.use(express.json());
appForCreateBook.post('/books', createBook);

// Unit tests for retrieving all books
describe('GET /books', () => {
  test('should return a list of books', async () => {
    const books = [
      { BookID: 1, Title: 'Book 1', Availability: true },
      { BookID: 2, Title: 'Book 2', Availability: false }
    ];
    Book.find.mockResolvedValue(books);

    const response = await request(appForBooks).get('/books');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(books);
  });

  test('should return 404 if no books are found', async () => {
    Book.find.mockResolvedValue([]);

    const response = await request(appForBooks).get('/books');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'No books exist matching the given query parameters.'
    });
  });

  test('should return 400 for invalid Availability query', async () => {
    const response = await request(appForBooks).get('/books?Availability=invalid');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid value for Availability. Use "true" or "false".'
    });
  });
});

// Unit tests for retrieving a single book by ID
describe('GET /books/:bookId', () => {
  test('should return a book if a valid BookID is provided', async () => {
    const mockBook = { BookID: 1, Title: 'Book 1', Author: 'Author 1' };
    Book.findOne.mockResolvedValue(mockBook);

    const response = await request(appForBookById).get('/books/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBook);
  });

  test('should return 400 for an invalid BookID', async () => {
    const response = await request(appForBookById).get('/books/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid BookID. Must be a number.'
    });
  });

  test('should return 404 if no book is found with the provided BookID', async () => {
    Book.findOne.mockResolvedValue(null);

    const response = await request(appForBookById).get('/books/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'No book exists with that id'
    });
  });

  test('should return 500 if a server error occurs', async () => {
    Book.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(appForBookById).get('/books/1');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error'
    });
  });
});

// Unit tests for updating a book
describe('PUT /books/:bookId', () => {
  test('should update a book when valid data is provided', async () => {
    const mockBook = {
      BookID: 1,
      Title: 'Updated Book',
      Author: 'Updated Author',
      ISBN: '1234567890',
      Genre: 'Fiction',
      PublicationYear: 2023,
      Availability: true,
      Publisher: 'Updated Publisher'
    };

    Book.findOneAndUpdate.mockResolvedValue(mockBook);

    const response = await request(appForUpdateBook).put('/books/1').send({
      Title: 'Updated Book',
      Author: 'Updated Author',
      ISBN: '1234567890',
      Genre: 'Fiction',
      PublicationYear: 2023,
      Availability: true,
      Publisher: 'Updated Publisher'
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Book updated successfully',
      book: mockBook
    });
  });

  test('should return 400 for an invalid bookId', async () => {
    const response = await request(appForUpdateBook).put('/books/invalid-id').send({
      Title: 'Updated Book'
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid bookId. Must be a number.'
    });
  });

  test('should return 404 if the book is not found', async () => {
    Book.findOneAndUpdate.mockResolvedValue(null);

    const response = await request(appForUpdateBook).put('/books/999').send({
      Title: 'Updated Book'
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Book not found'
    });
  });

  test('should return 500 if a server error occurs', async () => {
    Book.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

    const response = await request(appForUpdateBook).put('/books/1').send({
      Title: 'Updated Book'
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error'
    });
  });
});

// Unit tests for deleting a book
describe('DELETE /books/:bookId', () => {
  test('should delete a book when a valid bookId is provided', async () => {
    const mockBook = {
      BookID: 1,
      Title: 'Book 1',
      Author: 'Author 1'
    };

    Book.findOneAndDelete.mockResolvedValue(mockBook);

    const response = await request(appForDeleteBook).delete('/books/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Book deleted successfully',
      book: mockBook
    });
  });

  test('should return 400 for an invalid bookId', async () => {
    const response = await request(appForDeleteBook).delete('/books/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid bookId. Must be a number.'
    });
  });

  test('should return 404 if the book is not found', async () => {
    Book.findOneAndDelete.mockResolvedValue(null);

    const response = await request(appForDeleteBook).delete('/books/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Book not found'
    });
  });

  test('should return 500 if a server error occurs', async () => {
    Book.findOneAndDelete.mockRejectedValue(new Error('Database error'));

    const response = await request(appForDeleteBook).delete('/books/1');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error'
    });
  });
});

// Unit tests for creating a new book
describe('POST /books', () => {
  test('should create a new book when valid data is provided', async () => {
    const newBook = {
      BookID: 1,
      Title: 'Test Book',
      Author: 'Test Author',
      ISBN: '1234567890',
      Genre: 'Fiction',
      PublicationYear: 2023,
      Availability: true,
      Publisher: 'Test Publisher'
    };

    Book.create.mockResolvedValue(newBook);

    const response = await request(appForCreateBook).post('/books').send(newBook);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(newBook);
  });

  test('should return 500 if the book creation fails', async () => {
    const newBook = {
      BookID: 1,
      Title: 'Test Book',
      Author: 'Test Author',
      ISBN: '1234567890',
      Genre: 'Fiction',
      PublicationYear: 2023,
      Availability: true,
      Publisher: 'Test Publisher'
    };

    Book.create.mockRejectedValue(new Error('Database error'));

    const response = await request(appForCreateBook).post('/books').send(newBook);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Some error occurred while adding the book',
      detail: 'Database error'
    });
  });
});
