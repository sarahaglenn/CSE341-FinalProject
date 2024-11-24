const router = require('express').Router();

const loansController = require('../controllers/loans');
// const validation = require('../middleware/validate.js'); //commented out until implemented
// const auth = require('../controllers/auth.js');

router.get('/', loansController.getLoans);

router.get('/:loanId', loansController.getLoanById);

router.post('/', loansController.createLoan);

// New PUT route to update a loan
router.put('/:loanId', loansController.updateLoan);

// New DELETE route to delete a loan
router.delete('/:loanId', loansController.deleteLoan);

module.exports = router;
