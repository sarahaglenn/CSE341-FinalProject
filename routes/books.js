const router = require('express').Router();
const booksController = require('../controllers/books');
const auth = require('../middleware/auth.js');

router.get('/', booksController.getBooks);

router.get('/:bookId', booksController.getBookById);

router.post('/', auth, booksController.createBook);

// New PUT route to update a book
router.put('/:bookId', auth, booksController.updateBook);

// New DELETE route to delete a book
router.delete('/:bookId', auth, booksController.deleteBook);

module.exports = router;
