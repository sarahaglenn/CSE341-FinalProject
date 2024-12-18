const Loan = require('../models/loan-model');
// const { ObjectId } = require('mongodb'); // not currently using this.

const getLoans = async (req, res) => {
  const { BookID, UserID } = req.query;

  const filter = {};
  if (BookID) {
    const bookIdNumber = parseInt(BookID, 10);
    if (isNaN(bookIdNumber)) {
      return res.status(400).json({ error: 'Invalid BookID. Must be a number.' });
    }
    filter.BookID = bookIdNumber;
  }
  if (UserID) {
    const userIdNumber = parseInt(UserID, 10);
    if (isNaN(userIdNumber)) {
      return res.status(400).json({ error: 'Invalid UserID. Must be a number.' });
    }
    filter.UserID = userIdNumber;
  }
  try {
    const loans = await Loan.find(filter);
    if (loans.length > 0) {
      res.status(200).json(loans);
    } else {
      return res.status(404).json({ error: 'No loans exist with those parameters.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const getLoanById = async (req, res) => {
  const loanId = parseInt(req.params.loanId, 10);
  if (isNaN(loanId)) {
    return res.status(400).json({ error: 'Invalid LoanID. It must be a number.' });
  }

  try {
    const loan = await Loan.findOne({ LoanID: loanId });
    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ error: 'No loan exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const createLoan = async (req, res) => {
  const loan = {
    LoanID: req.body.LoanID,
    BookID: req.body.BookID,
    DateOut: req.body.DateOut,
    DueDate: req.body.DueDate,
    UserID: req.body.UserID
  };

  try {
    const result = await Loan.create(loan);
    res.status(200).json(result);
  } catch (error) {
    // console.error('Error creating loan:', error.message);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const updateLoan = async (req, res) => {
  const loanId = parseInt(req.params.loanId, 10);

  if (isNaN(loanId)) {
    return res.status(400).json({ error: 'Invalid loanId. Must be a number.' });
  }

  const updateData = {
    UserID: req.body.UserID,
    BookID: req.body.BookID,
    DateOut: req.body.DateOut,
    DueDate: req.body.DueDate
  };

  try {
    const updatedLoan = await Loan.findOneAndUpdate({ LoanID: loanId }, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json({
      message: 'Loan updated successfully',
      loan: updatedLoan
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const deleteLoan = async (req, res) => {
  const loanId = parseInt(req.params.loanId, 10);

  if (isNaN(loanId)) {
    return res.status(400).json({ error: 'Invalid loanId. Must be a number.' });
  }

  try {
    const deletedLoan = await Loan.findOneAndDelete({ LoanID: loanId });

    if (!deletedLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json({
      message: 'Loan deleted successfully',
      loan: deletedLoan
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

module.exports = {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
};
