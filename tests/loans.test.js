const request = require('supertest');
const express = require('express');
const { getLoans, getLoanById, updateLoan, deleteLoan } = require('../controllers/loans');

// Mock the Mongoose Loan model
jest.mock('../models/loan-model', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

const Loan = require('../models/loan-model');

// Set up Express apps for routes
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

// Tests for GET /loans
describe('GET /loans', () => {
  test('should return a list of loans', async () => {
    const loans = [
      {
        LoanID: 10,
        BookID: 1,
        UserID: 1,
        DateOut: '2024-11-04',
        DueDate: '2024-11-25',
      },
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
    expect(response.body).toEqual({
      error: 'No loans exist with those parameters.',
    });
  });

  test('should return 500 if a server error occurs', async () => {
    Loan.find.mockRejectedValue(new Error('Database error'));

    const response = await request(appForLoans).get('/loans');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error',
    });
  });
});

// Tests for retrieving a single loan
describe('GET /loans/:loanId', () => {
  test('should return a loan if a valid LoanID is provided', async () => {
    const mockLoan = {
      LoanID: 10,
      BookID: 1,
      UserID: 1,
      DateOut: '2024-11-04',
      DueDate: '2024-11-25',
    };
    Loan.findOne.mockResolvedValue(mockLoan);

    const response = await request(appForLoanById).get('/loans/10');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLoan);
  });

  test('should return 400 for an invalid LoanID', async () => {
    const response = await request(appForLoanById).get('/loans/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid LoanID. It must be a number.',
    });
  });

  test('should return 404 if no loan is found with the provided LoanID', async () => {
    Loan.findOne.mockResolvedValue(null);

    const response = await request(appForLoanById).get('/loans/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'No loan exists with that id',
    });
  });
});

// Tests for updating a loan
describe('PUT /loans/:loanId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update a loan when valid data is provided', async () => {
    const mockLoan = {
      LoanID: 10,
      BookID: 1,
      UserID: 1,
      DateOut: '2024-11-04',
      DueDate: '2024-11-25',
    };

    Loan.findOneAndUpdate.mockResolvedValue(mockLoan);

    const response = await request(appForUpdateLoan)
      .put('/loans/10')
      .send({
        LoanID: 10,
        BookID: 1,
        UserID: 1,
        DateOut: '2024-11-04',
        DueDate: '2024-11-25',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Loan updated successfully',
      loan: mockLoan,
    });
  });

  test('should return 400 for an invalid loanID', async () => {
    const response = await request(appForUpdateLoan).put('/loans/invalid-id').send({
      LoanID: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid loanId. Must be a number.',
    });
  });

  test('should return 404 if the loan is not found', async () => {
    Loan.findOneAndUpdate.mockResolvedValue(null);

    const response = await request(appForUpdateLoan).put('/loans/999').send({
      LoanID: 100,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Loan not found',
    });
  });

  test('should return 500 if a server error occurs', async () => {
    Loan.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

    const response = await request(appForUpdateLoan).put('/loans/10').send({
      LoanID: 100,
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error',
    });
  });
});

// Tests for deleting a loan
describe('Delete /loans/:loanId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should delete a loan when a valid loanId is provided', async () => {
      const mockLoan = {
        LoanID: 10,
        BookID: 1,
        UserID: 1,
        DateOut: '2024-11-04',
        DueDate: '2024-11-25',
      };
  
      Loan.findOneAndDelete.mockResolvedValue(mockLoan);
  
      const response = await request(appForDeleteLoan).delete('/loans/10');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Loan deleted successfully',
        loan: mockLoan, // Ensure the key matches the controller response
      });
    });
  
    test('should return 400 for an invalid loanId', async () => {
      const response = await request(appForDeleteLoan).delete('/loans/invalid-id');
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid loanId. Must be a number.',
      });
    });
  
    test('should return 404 if the loan is not found', async () => {
      Loan.findOneAndDelete.mockResolvedValue(null);
  
      const response = await request(appForDeleteLoan).delete('/loans/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Loan not found',
      });
    });
  
    test('should return 500 if a server error occurs', async () => {
      Loan.findOneAndDelete.mockRejectedValue(new Error('Database error'));
  
      const response = await request(appForDeleteLoan).delete('/loans/10');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal Server Error',
        detail: 'Database error',
      });
    });
  });