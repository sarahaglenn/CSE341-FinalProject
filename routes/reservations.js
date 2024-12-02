const router = require('express').Router();
const reservationsController = require('../controllers/reservations');
const auth = require('../middleware/auth.js');

router.get('/', auth, reservationsController.getReservations);

router.get('/:reservationId', auth, reservationsController.getReservationById);

router.post('/', auth, reservationsController.createReservation);

// New PUT route to update a Reservation
router.put('/:reservationId', auth, reservationsController.updateReservation);

// New DELETE route to delete a Reservation
router.delete('/:reservationId', auth, reservationsController.deleteReservation);

module.exports = router;
