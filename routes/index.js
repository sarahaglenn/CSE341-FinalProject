const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Book Worm API');
});

router.use('/users', require('./users'));
router.use('/books', require('./books'));
router.use('/reservations', require('./reservations'));
router.use('/loans', require('./loans'));
router.use('/api-docs', require('./swagger'));

module.exports = router;
