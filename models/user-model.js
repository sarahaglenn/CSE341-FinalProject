const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  UserID: {
    type: Number,
    required: true,
    unique: true
  },
  FirstName: {
    type: String,
    default: null
  },
  LastName: {
    type: String,
    default: null
  },
  UserType: {
    type: String,
    default: "Patron",
    enum: ["Patron", "Staff"]
  },
  MailingAddress: {
    type: String,
    default: null
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
