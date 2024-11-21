const router = require('express').Router();

const loansController = require('../controllers/loans');
// const validation = require('../middleware/validate.js'); //commented out until implemented
// const auth = require('../controllers/auth.js');

router.get('/', loansController.getLoans);

router.get('/:loanId', loansController.getLoanById);

router.post('/', loansController.createLoan);

// router.get('/:userId', loansController.getLoanByUserId); // Trying with query params instead

// router.get('/:bookId', loansController.getLoanByBookId); // Trying with query params instead

module.exports = router;
