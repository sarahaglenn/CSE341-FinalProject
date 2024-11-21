const router = require('express').Router();

const loansController = require('../controllers/loans');
// const validation = require('../middleware/validate.js'); //commented out until implemented
// const auth = require('../controllers/auth.js');

router.get('/', loansController.getLoans);

router.get('/:loanId', loansController.getLoanById);

router.post('/', loansController.createLoan);

module.exports = router;
