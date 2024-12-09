const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const Reservation = require('../models/reservation-model');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockToken'),
  verify: jest.fn((token) => {
    if (token === 'mockToken') {
      return { googleId: 'mockGoogleId', name: 'Mock User', email: 'mock@example.com' };
    }
    throw new Error('Invalid token');
  })
}));

jest.mock('../models/reservation-model', () => ({
  find: jest.fn((filter) => {
    if (filter && filter.UserID !== undefined) {
      return Promise.resolve(mockReservations.filter((res) => res.UserID === filter.UserID));
    }
    return Promise.resolve(mockReservations);
  }),
  findOne: jest.fn((query) => {
    const id = query.ReservationID;
    return Promise.resolve(mockReservations.find((res) => res.ReservationID === id));
  }),
  create: jest.fn((data) => {
    if (!data.BookID || !data.ReservationDate || !data.UserID) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.message = 'All fields (ReservationID, BookID, ReservationDate, UserID) are required.';
      return Promise.reject(validationError);
    }
    return Promise.resolve({
      ReservationID: data.ReservationID,
      BookID: data.BookID,
      ReservationDate: data.ReservationDate,
      UserID: data.UserID
    });
  }),
  findOneAndUpdate: jest.fn((query, updateData) => {
    if (updateData.BookID && isNaN(updateData.BookID)) {
      return Promise.reject({
        name: 'ValidationError'
      });
    }

    const reservation = mockReservations.find((res) => res.ReservationID === query.ReservationID);
    if (!reservation) return Promise.resolve(null);
    const updatedReservation = Object.assign(reservation, updateData);
    return updatedReservation;
  }),
  findOneAndDelete: jest.fn((query) => {
    const id = query.ReservationID;
    const index = mockReservations.findIndex((res) => res.ReservationID === id);
    if (index === -1) return Promise.resolve(null);
    const deletedReservation = { ...mockReservations[index] };
    mockReservations.splice(index, 1);
    return Promise.resolve(deletedReservation);
  })
}));

const mockReservations = [
  { ReservationID: 1, BookID: 1, ReservationDate: '2024-11-01', UserID: 1 },
  { ReservationID: 2, BookID: 2, ReservationDate: '2024-11-02', UserID: 2 },
  { ReservationID: 3, BookID: 3, ReservationDate: '2024-11-03', UserID: 3 },
  { ReservationID: 4, BookID: 2, ReservationDate: '2024-12-12', UserID: 2 }
];

describe('GET /reservations', () => {
  test('responds to GET all reservations with no query parameters', async () => {
    const res = await request.get('/reservations').set('Authorization', 'Bearer mockToken');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.body).toEqual(mockReservations);
    expect(res.statusCode).toBe(200);
  });
  test('responds to GET /reservations with valid query parameters', async () => {
    const userId = 1;
    const res = await request
      .get('/reservations')
      .query({ UserID: userId })
      .set('Authorization', 'Bearer mockToken');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((reservation) => {
      expect(reservation.UserID).toBe(userId);
    });
  });
  test('responds to GET /reservations with out of bounds query parameters', async () => {
    const userId = 999;
    const res = await request
      .get('/reservations')
      .query({ UserID: userId })
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: 'No reservations exist matching the given query parameters.'
    });
  });
  test('responds to GET /reservations with invalid query parameters', async () => {
    const userId = 'a';
    const res = await request
      .get('/reservations')
      .query({ UserID: userId })
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid UserID. Must be a number.' });
  });
  test('handles server errors', async () => {
    jest.spyOn(Reservation, 'find').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const res = await request.get('/reservations').set('Authorization', 'Bearer mockToken');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Internal Server Error'
    });
  });
});

describe('Test GET /reservations/reservationId', () => {
  test('responds to GET /reservations/reservationId', async () => {
    const reservationId = 2;
    const res = await request
      .get(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    const actualReservation = res.body;
    expect(actualReservation).toMatchObject(mockReservations[1]);
  });
  test('responds with 400 for invalid ReservationID', async () => {
    const reservationId = 'a';
    const res = await request
      .get(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(400);
  });
  test('responds with 404 if no reservation matches ReservationID', async () => {
    const reservationId = 99;
    const res = await request
      .get(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'No reservation exists with that id.' });
  });
  test('handles server errors', async () => {
    jest.spyOn(Reservation, 'findOne').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const reservationId = 27;
    const res = await request
      .get(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Internal Server Error'
    });
  });
});

describe('Test POST /reservations', () => {
  let createdReservationId;

  afterEach(async () => {
    if (createdReservationId) {
      await Reservation.findOneAndDelete(createdReservationId);
    }
  });
  test('creates a new reservation with valid data', async () => {
    const res = await request
      .post('/reservations')
      .send(mockReservations[0])
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(201);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');

    createdReservationId = res.body._id;

    expect(res.body).toMatchObject(mockReservations[0]);
  });
  test('responds with 400 if required fields are missing', async () => {
    const incompleteReservation = {
      ReservationID: 26,
      BookID: 1,
      UserID: 2
    };
    const res = await request
      .post('/reservations')
      .send(incompleteReservation)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toContain('All fields (ReservationID, BookID, ReservationDate, UserID) are required.');
  });
  test('responds with 400 if invalid data is provided', async () => {
    const invalidReservation = {
      ReservationID: 'abc'
    };
    const res = await request
      .post('/reservations')
      .send(invalidReservation)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
  test('handles server errors', async () => {
    const validReservation = {
      ReservationID: 27,
      BookID: 2,
      ReservationDate: '2024-10-31',
      UserID: 1
    };

    jest.spyOn(Reservation, 'create').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const res = await request
      .post('/reservations')
      .send(validReservation)
      .set('Authorization', 'Bearer mockToken');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      detail: 'Internal Server Error',
      error: 'Internal Server Error'
    });
  });
});

describe('Test PUT /reservations/reservationId', () => {
  const originalReservation = {
    ReservationID: 3,
    BookID: 3,
    ReservationDate: '2024-11-25',
    UserID: 1
  };

  afterEach(async () => {
    await Reservation.findOneAndUpdate(
      { ReservationID: originalReservation.ReservationID },
      originalReservation,
      { runValidators: true }
    );
  });
  test('updates a reservation with valid data', async () => {
    const reservationId = 3;
    const updatedReservation = {
      BookID: 2,
      ReservationDate: '2024-10-31',
      UserID: 2
    };
    const res = await request
      .put(`/reservations/${reservationId}`)
      .send(updatedReservation)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');

    console.log(res.body);
    expect(res.body).toMatchObject({
      ReservationID: 3,
      BookID: 2,
      ReservationDate: '2024-10-31',
      UserID: 2
    });
  });
  test('responds with 500 if invalid data is provided', async () => {
    const reservationId = 3;
    const invalidReservation = {
      BookID: 'abc'
    };
    const res = await request
      .put(`/reservations/${reservationId}`)
      .send(invalidReservation)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBeDefined();
  });
  test('responds with 404 if no reservation matches ReservationID', async () => {
    const reservationId = 99;
    const res = await request
      .put(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Reservation not found' });
  });
  test('handles server errors', async () => {
    const reservationId = 3;
    const validReservation = {
      ReservationID: 55,
      BookID: 2,
      ReservationDate: '2024-10-31',
      UserID: 1
    };

    jest.spyOn(Reservation, 'findOneAndUpdate').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const res = await request
      .put(`/reservations/${reservationId}`)
      .send(validReservation)
      .set('Authorization', 'Bearer mockToken');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Internal Server Error'
    });
  });
});

describe('Test DELETE /reservations/reservationId', () => {
  const newReservation = {
    ReservationID: 4,
    BookID: 2,
    ReservationDate: '2024-12-12',
    UserID: 2
  };
  beforeEach(async () => {
    const existingReservation = await Reservation.findOne({
      ReservationID: newReservation.ReservationID
    });
    if (!existingReservation) {
      await Reservation.create(newReservation);
    }
  });
  test('responds to DELETE /reservations/reservationId', async () => {
    const reservationId = 4;
    const res = await request
      .delete(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: 'Reservation deleted successfully',
      reservation: {
        ReservationID: 4,
        BookID: 2,
        ReservationDate: '2024-12-12',
        UserID: 2
      }
    });
  });
  test('responds with 400 for invalid ReservationID', async () => {
    const reservationId = 'a';
    const res = await request
      .delete(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(400);
  });
  test('responds with 404 if no reservation matches ReservationID', async () => {
    const reservationId = 99;
    const res = await request
      .delete(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Reservation not found' });
  });
  test('handles server errors', async () => {
    jest.spyOn(Reservation, 'findOneAndDelete').mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    const reservationId = 4;
    const res = await request
      .delete(`/reservations/${reservationId}`)
      .set('Authorization', 'Bearer mockToken');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Internal Server Error'
    });
  });
});

