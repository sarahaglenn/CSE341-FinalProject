const Reservation = require('../models/reservation-model');
// const { ObjectId } = require('mongodb'); // not currently using this.

const getReservations = async (req, res) => {
  const { UserID } = req.query;

  const filter = {};
  if (UserID) {
    filter.UserID = UserID;
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
    const reservation = await Reservation.find({ ReservationID: reservationId });
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

const createReservation = async (req, res) => {
  const reservation = {
    BookID: req.body.BookID,
    ReservationDate: req.body.ReservationDate,
    UserID:req.body.UserID
  };

  const result = await Reservation.create(reservation);
  console.log(result);


  if(result._id != null){
    res.status(200).json(reservation);
  } else {
    res.status(500).json(response.error || "Some error occured while adding the reservation");
  }
}; 

module.exports = {
  getReservations,
  getReservationById,
  createReservation
};
