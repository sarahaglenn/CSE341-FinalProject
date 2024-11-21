const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  ReservationID: {
    type: String,
    //required: true,
    unique: true
  },
  BookID: {
    type: String,
    required: true
  },
  ReservationDate: {
    type: String,
    required: true
  },
  UserID: {
    type: String,
    required: true
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema, 'Reservations');

module.exports = Reservation;
