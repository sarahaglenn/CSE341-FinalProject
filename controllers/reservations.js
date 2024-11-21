const Reservation = require('../models/reservation-model');
// const { ObjectId } = require('mongodb'); // not currently using this.

const getReservations = async (req, res) => {
  const { UserID } = req.query;

  const filter = {};
  if (UserID) {
    const userIdNumber = parseInt(UserID, 10);
    if (isNaN(userIdNumber)) {
      return res.status(400).json({ error: 'Invalid UserID. Must be a number.' });
    }
    filter.UserID = userIdNumber;
  }
  try {
    const reservations = await Reservation.find(filter);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const getReservationById = async (req, res) => {
  const reservationId = parseInt(req.params.reservationId);
  if (isNaN(reservationId)) {
    return res.status(400).json({ error: 'Invalid ReservationID. Must be a number.' });
  }
  try {
    const reservation = await Reservation.findOne({ ReservationID: reservationId });
    if (reservation) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ error: 'No reservations exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const createReservation = async (req, res) => {
  const reservation = {
    BookID: req.body.BookID,
    ReservationDate: req.body.ReservationDate,
    UserID: req.body.UserID
  };

  const result = await Reservation.create(reservation);
  console.log(result);

  if (result._id != null) {
    res.status(200).json(reservation);
  } else {
    res.status(500).json(response.error || 'Some error occurred while adding the reservation');
  }
};

module.exports = {
  getReservations,
  getReservationById,
  createReservation
};
