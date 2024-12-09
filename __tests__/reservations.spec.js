
const request = require('supertest');
const app = require('../server'); // Adjusted to use server.js

jest.mock('../models/reservation-model', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndDelete: jest.fn()
}));

const Reservation = require('../models/reservation-model');
// Mock authentication middleware
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { id: 1, name: 'Test User' }; // Mock user data
  next();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('Reservations API', () => {
  test('GET /reservations should return all reservations', async () => {
    const mockReservations = [
      { ReservationID: 1, BookID: 10, ReservationDate: '2024-12-01', UserID: 1 },
      { ReservationID: 2, BookID: 20, ReservationDate: '2024-12-02', UserID: 1 }
    ];
    Reservation.find.mockResolvedValue(mockReservations);

    const res = await request(app).get('/reservations').set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockReservations);
  });

  test('POST /reservations should create a new reservation', async () => {
    const newReservation = {
      ReservationID: 101,
      BookID: 12,
      ReservationDate: '2024-12-07',
      UserID: 1
    };
    Reservation.create.mockResolvedValue(newReservation);

    const res = await request(app)
      .post('/reservations')
      .send(newReservation)
      .set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(newReservation);
  });

  test('GET /reservations/:reservationId should return a specific reservation', async () => {
    const mockReservation = { ReservationID: 101, BookID: 12, ReservationDate: '2024-12-07', UserID: 1 };
    Reservation.findOne.mockResolvedValue(mockReservation);

    const res = await request(app)
      .get('/reservations/101')
      .set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockReservation);
  });

  test('DELETE /reservations/:reservationId should delete a reservation', async () => {
    Reservation.findOneAndDelete.mockResolvedValue({ message: 'Reservation deleted successfully' });

    const res = await request(app)
      .delete('/reservations/101')
      .set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
    message: 'Reservation deleted successfully',
    reservation: { message: 'Reservation deleted successfully' },
  });
  });
});