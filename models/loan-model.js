const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema({
  LoanID: {
    type: String,
    //required: true,
    unique: true
  },
  BookID: {
    type: String,
    required: true
  },
  DateOut: {
    type: String,
    required: true
  },
  DueDate: {
    type: String,
    required: true
  },
  UserID: {
    type: String,
    required: true
  }
});

const Loan = mongoose.model('Loan', loanSchema, 'Loan');

module.exports = Loan;
