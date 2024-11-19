const Reservation = require('../models/reservation-model');
const { ObjectId } = require('mongodb'); // not currently using this.

const getReservations = async (req, res) => {
  const { UserId } = req.query;

  const filter = {};
  if (UserId) {
    filter.userId = UserId;
  }
  try {
    const reservations = await Reservation.find(filter);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving reservations', detail: error.message });
  }
};

const getReservationById = async (req, res) => {
  const reservationId = req.params.reservationId;
  try {
    const reservation = await Reservation.find({ ReservationId: reservationId });
    if (reservation) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ error: 'No reservations exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving reservation.', detail: error.message });
  }
};

module.exports = {
  getReservations,
  getReservationById
};
