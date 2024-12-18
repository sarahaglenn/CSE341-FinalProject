const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema(
  {
    LoanID: {
      type: Number,
      required: true,
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
  },
  {
    versionKey: false
  }
);

const Loan = mongoose.model('Loan', loanSchema, 'Loan');

module.exports = Loan;
