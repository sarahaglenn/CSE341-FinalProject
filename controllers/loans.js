const Loan = require('../models/loan-model');
// const { ObjectId } = require('mongodb'); // not currently using this.

const getLoans = async (req, res) => {
  const { BookId, UserId } = req.query;

  const filter = {};
  if (BookId) {
    filter.BookID = BookId;
  }
  if (UserId) {
    filter.UserID = UserId;
  }
  try {
    const loans = await Loan.find(filter);
    // res.setHeader('Content-Type', 'application/json'); //handled by express
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving loans', detail: error.message });
  }
};

const getLoanById = async (req, res) => {
  const loanId = parseInt(req.params.loanID, 10);
  if (isNaN(loanId)) {
    return res.status(400).json({ error: 'Invalid Loan ID. It must be a number.' });
  }

  try {
    const loan = await Loan.findOne({ LoanID: loanId });
    if (loan) {
      //   res.setHeader('Content-Type', 'application/json'); //handled by express
      res.status(200).json(loan);
    } else {
      res.status(404).json({ error: 'No loans exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving loan.', detail: error.message });
  }
};

// const getLoanByUserId = async (req, res) => { }; // handled with query params to make clearer
// const getLoanByBookId = async (req, res) => { };

module.exports = {
  getLoans,
  getLoanById
  // getLoanByUserId,
  // getLoanByBookId
};
