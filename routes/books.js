const router = require('express').Router();

const booksController = require('../controllers/books');
// const validation = require('../middleware/validate.js'); //commented out until implemented
// const auth = require('../controllers/auth.js');

router.get('/', booksController.getBooks);

router.get('/:bookId', booksController.getBookById);

router.post('/', booksController.createBook);

module.exports = router;
