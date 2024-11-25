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
    ReservationID: req.body.ReservationID,
    BookID: req.body.BookID,
    ReservationDate: req.body.ReservationDate,
    UserID: req.body.UserID
  };

  const result = await Reservation.create(reservation);

  if (result._id != null) {
    res.status(200).json(reservation);
  } else {
    res.status(500).json(res.error || 'Some error occurred while adding the reservation');
  }
};

const updateReservation = async (req, res) => {
  const reservationId = parseInt(req.params.reservationId, 10);

  // Validate reservationId
  if (isNaN(reservationId)) {
    return res.status(400).json({ error: 'Invalid reservationId. Must be a number.' });
  }

  const updateData = {
    UserID: req.body.UserID,
    BookID: req.body.BookID,
    ReservationDate: req.body.ReservationDate
  };

  try {
    const updatedReservation = await Reservation.findOneAndUpdate(
      { ReservationID: reservationId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.status(200).json({
      message: 'Reservation updated successfully',
      reservation: updatedReservation
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  const reservationId = parseInt(req.params.reservationId, 10);

  // Validate reservationId
  if (isNaN(reservationId)) {
    return res.status(400).json({ error: 'Invalid reservationId. Must be a number.' });
  }

  try {
    // Find and delete the reservation by ReservationID
    const deletedReservation = await Reservation.findOneAndDelete({ ReservationID: reservationId });

    if (!deletedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.status(200).json({
      message: 'Reservation deleted successfully',
      reservation: deletedReservation
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
