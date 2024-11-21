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
    default: 'patron',
    enum: ['patron', 'staff']
  },
  MailingAddress: {
    type: String,
    default: null
  }
});

const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
