const router = require('express').Router();

const reservationsController = require('../controllers/reservations');
// const validation = require('../middleware/validate.js'); //commented out until implemented
// const auth = require('../controllers/auth.js');

router.get('/', reservationsController.getReservations);

router.get('/:reservationId', reservationsController.getReservationById);

router.post('/', reservationsController.createReservation);

module.exports = router;
