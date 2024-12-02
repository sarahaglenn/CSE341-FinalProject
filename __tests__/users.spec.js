const request = require('supertest');
const express = require('express');
const {
  getUsers,
  getUserById,
  getUserByType,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

//Mock the Mongoose User Model
jest.mock('../models/user-model', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  create: jest.fn()
}));

const User = require('../models/user-model');

//Set Up separate Express apps for each route
//Set up for getting all Users
const appForUsers = express();
appForUsers.use(express.json());
appForUsers.get('/users', getUsers);

//Set up for getting a single user by Id
const appForUserById = express();
appForUserById.use(express.json());
appForUserById.get('/users/:userId', getUserById);

//Set up for getting users by user type
const appForUserByType = express();
appForUserByType.use(express.json());
appForUserByType.get('/users/type/:userType', getUserByType);

//Set up for creating user
const appForCreatingUser = express();
appForCreatingUser.use(express.json());
appForCreatingUser.post('/users', createUser);

//Set up for updating a user
const appForUpdatingUser = express();
appForUpdatingUser.use(express.json());
appForUpdatingUser.put('/users/:userId', updateUser);

//Set up for deleting a user
const appForDeletingUser = express();
appForDeletingUser.use(express.json());
appForDeletingUser.delete('/users/:userId', deleteUser);

//Testing For getting all users
describe('Get /users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  //Test 200
  test('should return a list of users', async () => {
    // Mock Data
    const mockUser = [
      {
        UserID: 1,
        FirstName: 'John',
        LastName: 'Doe',
        UserType: 'patron',
        MailingAddress: '123 Main St'
      }
    ];
    User.find.mockResolvedValue(mockUser);
    // Make Request and assert response
    const response = await request(appForUsers).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });
  // Test 404
  test('should return 404 if no users are found', async () => {
    User.find.mockResolvedValue([]);
    // Make Request and assert response
    const response = await request(appForUsers).get('/users');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'No users exist with those parameters.'
    });
  });
  //Test 500
  test('should return 500 if server error occurs', async () => {
    User.find.mockRejectedValue(new Error('Database Error'));

    const response = await request(appForUsers).get('/users');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database Error'
    });
  });
});

//Testing For retrieving a single user by ID
describe('GET /users/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test 200
  test('should return a user if a valid UserId is provided', async () => {
    // Mock Data Single user
    const mockUser = [
      {
        UserID: 1,
        FirstName: 'John',
        LastName: 'Doe',
        UserType: 'patron',
        MailingAddress: '123 Main St'
      }
    ];
    User.findOne.mockResolvedValue(mockUser);
    // Make request and assert response
    const response = await request(appForUserById).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });
  // Test 400 invalid User ID
  test('should return 400 for an invalid UserID', async () => {
    // Make request and assert response
    const response = await request(appForUserById).get('/users/abc');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid UserID. Must be a number.'
    });
  });
  // Test 404 no user found with ID
  test('should return 404 if no user is found with the provided userId', async () => {
    // Mock date equals null
    User.findOne.mockResolvedValue(null);
    // Make Request and assert response
    const response = await request(appForUserById).get('/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'No user exists with that id'
    });
  });
  // Test 500 server error occurs
  test('should return 500 if server error occurs', async () => {
    User.findOne.mockRejectedValue(new Error('Database Error'));
    // Make request and assert response
    const response = await request(appForUserById).get('/users/1');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database Error'
    });
  });
});

// Testing for retrieving users by UserType='staff'
describe('GET /users/type/:userType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test 200
  test('should return a list of users for a valid user type (staff)', async () => {
    const mockUsers = [
      { UserId: 1, FirstName: 'John', LastName: 'Doe', UserType: 'staff' },
      { UserId: 2, FirstName: 'Jane', LastName: 'Smith', UserType: 'staff' }
    ];
    User.find.mockResolvedValue(mockUsers);

    const response = await request(appForUserByType).get('/users/type/staff');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  test('should return a list of users for a valid user type (patron)', async () => {
    const mockUsers = [
      { UserId: 1, FirstName: 'John', LastName: 'Doe', UserType: 'patron' },
      { UserId: 2, FirstName: 'Jane', LastName: 'Smith', UserType: 'patron' }
    ];
    User.find.mockResolvedValue(mockUsers);

    const response = await request(appForUserByType).get('/users/type/patron');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  // Test 400 invalid userType
  test('should return 400 for an invalid user type', async () => {
    const response = await request(appForUserByType).get('/users/type/librarian');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Must use a valid user type to find a user.'
    });
  });

  // Test 404 no users with user type
  test('should return 404 for no users of specified type', async () => {
    User.find.mockResolvedValue([]);

    const response = await request(appForUserByType).get('/users/type/staff');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'No users exist with that user type.'
    });
  });

  // Test 500 server error occurs
  test('should return 500 if a server error occurs', async () => {
    User.find.mockRejectedValue(new Error('Database Error'));

    const response = await request(appForUserByType).get('/users/type/staff');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database Error'
    });
  });
});

// Testing for POST creating a user
describe('POST /users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should create a new user when valid data is provided', async () => {
    const mockUser = {
      UserID: 1,
      FirstName: 'John',
      LastName: 'Doe',
      UserType: 'patron',
      MailingAddress: '123 Main St'
    };
    User.create.mockResolvedValue(mockUser);
    // Make Request and assert response
    const response = await request(appForCreatingUser).post('/users').send(mockUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  test('should return 500 if the user creation fails', async () => {
    const mockUser = {
      UserID: 1,
      FirstName: 'John',
      LastName: 'Doe',
      UserType: 'patron',
      MailingAddress: '123 Main St'
    };

    User.create.mockRejectedValue(new Error('Database error'));

    const response = await request(appForCreatingUser).post('/users').send(mockUser);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error'
    });
  });
});

// Unit tests for deleting a user
describe('DELETE /users/:userId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should delete a user when a valid userId is provided', async () => {
    const mockUser = {
      UserID: 77,
      FirstName: 'First',
      LastName: 'Last',
      UserType: 'patron',
      MailingAddress: '123 Main St'
    };

    User.findOneAndDelete.mockResolvedValue(mockUser);

    const response = await request(appForDeletingUser).delete('/users/77');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'User deleted successfully',
      user: mockUser
    });
  });

  test('should return 400 for an invalid userId', async () => {
    const response = await request(appForDeletingUser).delete('/users/abc');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid userId. Must be a number.'
    });
  });

  test('should return 404 if the user is not found', async () => {
    User.findOneAndDelete.mockResolvedValue(null);

    const response = await request(appForDeletingUser).delete('/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'User not found'
    });
  });

  test('should return 500 if a server error occurs', async () => {
    User.findOneAndDelete.mockRejectedValue(new Error('Database error'));

    const response = await request(appForDeletingUser).delete('/users/1');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      detail: 'Database error'
    });
  });
});
