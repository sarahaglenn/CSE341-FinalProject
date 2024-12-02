const router = require('express').Router();
const loansController = require('../controllers/loans');
const auth = require('../middleware/auth.js');

router.get('/', auth, loansController.getLoans);

router.get('/:loanId', auth, loansController.getLoanById);

router.post('/', auth, loansController.createLoan);

// New PUT route to update a loan
router.put('/:loanId', auth, loansController.updateLoan);

// New DELETE route to delete a loan
router.delete('/:loanId', auth, loansController.deleteLoan);

module.exports = router;
