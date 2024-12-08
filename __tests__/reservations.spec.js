
const request = require('supertest');
const app = require('../server'); // Adjusted to use server.js

// Mock authentication middleware
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { id: 1, name: 'Test User' }; // Mock user data
  next();
});

describe('Reservations API', () => {
  test('GET /reservations should return all reservations', async () => {
    const res = await request(app).get('/reservations').set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /reservations should create a new reservation', async () => {
    const newReservation = {
      ReservationID: 101,
      BookID: 12,
      ReservationDate: '2024-12-07',
      UserID: 1,
    };
    const res = await request(app)
      .post('/reservations')
      .send(newReservation)
      .set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(newReservation);
  });

  test('GET /reservations/:reservationId should return a specific reservation', async () => {
    const res = await request(app).get('/reservations/101').set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ReservationID', 101);
  });

  test('DELETE /reservations/:reservationId should delete a reservation', async () => {
    const res = await request(app).delete('/reservations/101').set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Reservation deleted successfully');
  });
});
