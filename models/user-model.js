const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    UserID: {
      type: Number,
      required: true,
      unique: true
    },
    FirstName: {
      required: true,
      type: String,
    },
    LastName: {
      required: true,
      type: String,
    },
    UserType: {
      required: true,
      type: String,
      enum: ['patron', 'staff']
    },
    MailingAddress: {
      required: true,
      type: String,
    }
  },
  {
    versionKey: false
  }
);

const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
