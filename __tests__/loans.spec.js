const request = require('supertest');
const express = require('express');
const {
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  createLoan
} = require('../controllers/loans');

// Mock the Mongoose Loan model
jest.mock('../models/loan-model', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  create: jest.fn()
}));

const Loan = require('../models/loan-model');

// Set up Express apps for each route
const appForLoans = express();
appForLoans.use(express.json());
appForLoans.get('/loans', getLoans);

const appForLoanById = express();
appForLoanById.use(express.json());
appForLoanById.get('/loans/:loanId', getLoanById);

const appForUpdateLoan = express();
appForUpdateLoan.use(express.json());
appForUpdateLoan.put('/loans/:loanId', updateLoan);

const appForDeleteLoan = express();
appForDeleteLoan.use(express.json());
appForDeleteLoan.delete('/loans/:loanId', deleteLoan);

const appForCreateLoan = express();
appForCreateLoan.use(express.json());
appForCreateLoan.post('/loans', createLoan);

// Tests for GET /loans
describe('GET /loans', () => {
  test('should return a list of loans', async () => {
    const loans = [
      { LoanID: 10, BookID: 1, UserID: 1, DateOut: '2024-11-04', DueDate: '2024-11-25' }
    ];
    Loan.find.mockResolvedValue(loans);

    const response = await request(appForLoans).get('/loans');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(loans);
  });

  test('should return 404 if no loans are found', async () => {
    Loan.find.mockResolvedValue([]);

    const response = await request(appForLoans).get('/loans');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No loans exist with those parameters.' });
  });

  test('should return 500 if a server error occurs', async () => {
    Loan.find.mockRejectedValue(new Error('Database error'));

    const response = await request(appForLoans).get('/loans');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error', detail: 'Database error' });
  });
});

// Tests for GET /loans/:loanId
describe('GET /loans/:loanId', () => {
  test('should return a loan if a valid LoanID is provided', async () => {
    const mockLoan = {
      LoanID: 10,
      BookID: 1,
      UserID: 1,
      DateOut: '2024-11-04',
      DueDate: '2024-11-25'
    };
    Loan.findOne.mockResolvedValue(mockLoan);

    const response = await request(appForLoanById).get('/loans/10');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLoan);
  });

  test('should return 400 for an invalid LoanID', async () => {
    const response = await request(appForLoanById).get('/loans/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid LoanID. It must be a number.' });
  });

  test('should return 404 if no loan is found', async () => {
    Loan.findOne.mockResolvedValue(null);

    const response = await request(appForLoanById).get('/loans/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No loan exists with that id' });
  });
});

// Tests for POST /loans
describe('POST /loans', () => {
  test('should create a new loan when valid data is provided', async () => {
    const newLoan = {
      LoanID: 10,
      BookID: 1,
      UserID: 1,
      DateOut: '2024-11-04',
      DueDate: '2024-11-25'
    };

    Loan.create.mockResolvedValue(newLoan);

    const response = await request(appForCreateLoan).post('/loans').send(newLoan);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(newLoan);
  });

  test('should return 500 if loan creation fails', async () => {
    const newLoan = {
      LoanID: 10,
      BookID: 1,
      UserID: 1,
      DateOut: '2024-11-04',
      DueDate: '2024-11-25'
    };

    Loan.create.mockRejectedValue(new Error('Database error'));

    const response = await request(appForCreateLoan).post('/loans').send(newLoan);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error'
    });
  });
});

// Tests for PUT /loans/:loanId
describe('PUT /loans/:loanId', () => {
  test('should update a loan when valid data is provided', async () => {
    const updatedLoan = {
      LoanID: 10,
      BookID: 1,
      UserID: 1,
      DateOut: '2024-11-04',
      DueDate: '2024-11-25'
    };

    Loan.findOneAndUpdate.mockResolvedValue(updatedLoan);

    const response = await request(appForUpdateLoan).put('/loans/10').send(updatedLoan);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Loan updated successfully',
      loan: updatedLoan
    });
  });

  test('should return 400 for an invalid loanId', async () => {
    const response = await request(appForUpdateLoan).put('/loans/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid loanId. Must be a number.' });
  });

  test('should return 404 if the loan is not found', async () => {
    Loan.findOneAndUpdate.mockResolvedValue(null);

    const response = await request(appForUpdateLoan).put('/loans/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Loan not found' });
  });
});

// Tests for DELETE /loans/:loanId
describe('DELETE /loans/:loanId', () => {
  test('should delete a loan when a valid loanId is provided', async () => {
    const mockLoan = {
      LoanID: 10,
      BookID: 1,
      UserID: 1,
      DateOut: '2024-11-04',
      DueDate: '2024-11-25'
    };

    Loan.findOneAndDelete.mockResolvedValue(mockLoan);

    const response = await request(appForDeleteLoan).delete('/loans/10');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Loan deleted successfully',
      loan: mockLoan
    });
  });

  test('should return 400 for an invalid loanId', async () => {
    const response = await request(appForDeleteLoan).delete('/loans/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid loanId. Must be a number.' });
  });

  test('should return 404 if the loan is not found', async () => {
    Loan.findOneAndDelete.mockResolvedValue(null);

    const response = await request(appForDeleteLoan).delete('/loans/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Loan not found' });
  });
});
