const Reservation = require('../models/reservation-model');

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
    if (reservations.length > 0) {
      res.status(200).json(reservations);
    } else {
      res.status(404).json({ error: 'No reservations exist matching the given query parameters.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const getReservationById = async (req, res) => {
  const reservationId = parseInt(req.params.reservationId, 10);
  if (isNaN(reservationId)) {
    return res.status(400).json({ error: 'Invalid ReservationID. Must be a number.' });
  }

  try {
    const reservation = await Reservation.findOne({ ReservationID: reservationId });
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ error: 'No reservation exists with that id.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const createReservation = async (req, res) => {
  const { ReservationID, BookID, ReservationDate, UserID } = req.body;

  if (!ReservationID || !BookID || !ReservationDate || !UserID) {
    return res.status(400).json({ error: 'All fields (ReservationID, BookID, ReservationDate, UserID) are required.' });
  }

  try {
    const newReservation = { ReservationID, BookID, ReservationDate, UserID };
    const reservation = await Reservation.create(newReservation);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const updateReservation = async (req, res) => {
  const reservationId = parseInt(req.params.reservationId, 10);
  if (isNaN(reservationId)) {
    return res.status(400).json({ error: 'Invalid ReservationID. Must be a number.' });
  }

  try {
    const updatedReservation = await Reservation.findOneAndUpdate(
      { ReservationID: reservationId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const deleteReservation = async (req, res) => {
  const reservationId = parseInt(req.params.reservationId, 10);
  if (isNaN(reservationId)) {
    return res.status(400).json({ error: 'Invalid ReservationID. Must be a number.' });
  }

  try {
    const deletedReservation = await Reservation.findOneAndDelete({ ReservationID: reservationId });

    if (!deletedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation deleted successfully', reservation: deletedReservation });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
