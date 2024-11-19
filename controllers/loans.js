const Loan = require('../models/loan-model');
const { ObjectId } = require('mongodb'); // not currently using this.

const getLoans = async (req, res) => {
    const { BookId, UserId } = req.query;

  const filter = {};
  if (BookId) {
    filter.bookId = BookId;
  }
    if (UserId) {
        filter.userId = UserId;
  }
  try {
    const loans = await Loan.find(filter);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving loans', detail: error.message });
  }
};

const getLoanById = async (req, res) => {

  const loanId = req.params.loanId;
  try {
    const loan = await Loan.find({ LoanId: loanId });
    if (loan) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(loan);
    } else {
      res.status(404).json({ error: 'No loans exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving loan.', detail: error.message });
  }
};

// const getLoanByUserId = async (req, res) => { };
// const getLoanByBookId = async (req, res) => { };

module.exports = {
    getLoans,
    getLoanById,
    // getLoanByUserId,
    // getLoanByBookId
};