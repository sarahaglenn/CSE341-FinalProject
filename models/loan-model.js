const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema({
  LoanID: {
    type: Number,
    // required: true, keeping untrue for example in routes.rest.
    // once the controller function has been updated, this can be changed back to required.
    unique: true
  },
  BookID: {
    type: Number,
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
    type: Number,
    required: true
  }
});

const Loan = mongoose.model('Loan', loanSchema, 'Loan');

module.exports = Loan;
