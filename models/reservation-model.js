const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    ReservationID: {
      type: Number,
      required: true,
      unique: true
    },
    BookID: {
      type: Number,
      required: true
    },
    ReservationDate: {
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

const Reservation = mongoose.model('Reservation', reservationSchema, 'Reservations');

module.exports = Reservation;
