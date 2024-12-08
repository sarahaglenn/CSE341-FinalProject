const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const reservationsController = require('../controllers/reservations');

router.get('/', authMiddleware, reservationsController.getReservations);
router.get('/:reservationId', authMiddleware, reservationsController.getReservationById);
router.post('/', authMiddleware, reservationsController.createReservation);
router.put('/:reservationId', authMiddleware, reservationsController.updateReservation);
router.delete('/:reservationId', authMiddleware, reservationsController.deleteReservation);

module.exports = router;
