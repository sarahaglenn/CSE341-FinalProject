const request = require('supertest');
const express = require('express');
const { getUsers, getUserById, getUserByType, createUser, updateUser, deleteUser} = require("../controllers/users");

//Mock the Mongoose Book Model
jest.mock('../models/user-model', () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
}));

const User = require ('../models/user-model');

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
appForCreatingUser.use(express.json);
appForCreatingUser.put('/users', createUser);

//Set up for updating a book
const appForUpdatingUser = express();
appForUpdatingUser.use(express.json);
appForUpdatingUser.put('/users/:userId', updateUser);

//Set up for deleting a book 
const appForDeletingUser = express();
appForDeletingUser.use(express.json);
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
                FirstName: "John",
                LastName: "Doe",
                UserType: "patron",
                MailingAddress: "123 Main St"
            },
        ];
        User.find.mockResolvedValue(mockUser);
        // Make Request and assert response
        const response = await request(appForUsers).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
    // Test 404
    test('should return 404 if no users are found', async () =>{
        User.find.mockResolvedValue([]);
        // Make Request and assert response
        const response = await request(appForUsers).get('/users');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: 'No users exist with those parameters.',
        });
    });
    //Test 500
    test('should return 500 if server error occurs', async () => {
        User.find.mockRejectedValue(new Error('Database Error'));

        const response = await request(appForUsers).get('/users');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Internal Server Error',
            detail: 'Database Error',
        });
    });
});

//Testing For retreiving a single user by ID
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
                FirstName: "John",
                LastName: "Doe",
                UserType: "patron",
                MailingAddress: "123 Main St"
            },
        ];
        User.findOne.mockResolvedValue(mockUser);
        // Make request and assert response
        const response = await request(appForUserById).get('/users/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
    // Test 400 invalid User ID
    test('should return 400 for an invalid UserID', async () =>{
        // Make request and assert response
        const response = await request(appForUserById).get('/users/invalid-id');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'Invalid UserID. Must be a number.',
        });
    });
    // Test 404 no user found with ID
    test("should return 404 if no user is found with the provided userId", async () => {
        // Mock date equals null
        User.findOne.mockResolvedValue(null);
        // Make Request and assert response
        const response = await request(appForUserById).get('/users/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: 'No user exists with that id',
        });
    });
    // Test 500 server error occurs
    test('should return 500 if server error occurs', async () => {
        User.find.mockRejectedValue(new Error('Database Error'));
        // Make request and assert response
        const response = await request(appForUsers).get('/users/1');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Internal Server Error',
            detail: 'Database Error',
        });
    });
});

// Testing for retreiving users by UserType='staff'
// // Test 200
// // Test 400 invalid usertype
// // Test 404 no users with user type
// // Test 500 server error occurs

// Testing for retreiving users by UserType='patron'
// // Test 200
// // Test 400 invalid usertype
// // Test 404 no users with user type
// // Test 500 server error occurs

// Testing for POST creating a user
// // Test 200
// // Test 400 required fields are missing 
// // Test 400 invalid data is provided
// // Test 500 server error occurs

// // Testing for updating a User
// describe('PUT /users/:userId', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//     // Test 200
//     test('should update a user when valid data is provided', async () => {
//         const mockUser = { 
//             UserID: 100, 
//             FirstName: 'Alfred', 
//             LastName: 'Hitchcock', 
//             UserType: 'patron',
//             MailingAddress: '123 Any St.'
//         };
//         User.findOneAndUpdate.mockResolvedValue(mockUser);

//         const response = await request(appForUpdatingUser)
//             .put('/users/100')
//             .send({
//                 UserID: 100, 
//                 FirstName: 'Alfred', 
//                 LastName: 'Hitchcock', 
//                 UserType: 'patron',
//                 MailingAddress: '456 New St.'
//         });

//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({
//             message: 'User updated successfully',
//             user: mockUser
//         });
//     });
//     // Test 400 invalid userID
//     test('should return 400 for an invalid UserId', async () => {
//         const response = await request(appForUpdatingUser)
//         .put('/users/invalid-id')
//         .send({
//             UserId: 200,
//         });

//         expect(response.status).toBe(400);
//         expect(response.body).toEqual({
//             error: 'Invalid UserId. Must be a number.',
//         });
//     });
//     // Test 404 user not found
//     test('should return a 404 if new user is found by provided userId', async () => {
//         User.findOneAndUpdate.mockRejectedValue(null);

//         const response = await request(appForUpdatingUser)
//         .put('/users/999').send({
//             UserId: 200, 
//         });

//         expect(response.status).toBe(404);
//         expect(response.body).toEqual({
//             error: 'User not found',
//         });
//     });
//     // Test 500 server error occurs
//     test('should return 500 if a server error occurs', async () => {
//         User.findOneAndUpdate.mockRejectedValue(new Error('Database Error'));

//         const response = await request(appForUpdatingUser)
//         .put('/users/100')
//         .send({
//             UserID:100
//         });

//         expect(response.status).toBe(500);
//         expect(response.body).toEqual({
//             error: 'Internal Server Error',
//             detail: 'Database error'
//         });
//     });
// }); 

// //Testing for deleting a user
// describe('Delete /users/:userId', () => {
//     beforeEach(() => {
//       jest.clearAllMocks();
//     });
//     // Test 200
//     test('should delete a user when a valid userId is provided', async () => {
//       const mockUser = {
//         UserID: 100,
//         FirstName: "John",
//         LastName: "Doe",
//         UserType: "patron",
//         MailingAddress: "123 Any St."        
//       };
  
//       User.findOneAndDelete.mockResolvedValue(mockUser);
  
//       const response = await request(appForDeletingUser).delete('/users/100');
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({
//         message: 'User deleted successfully',
//         user: mockUser, 
//       });
//     });
//     // Test 400 invalid userID
//     test('should return 400 for an invalid userId', async () => {
//       const response = await request(appForDeletingUser).delete('/users/invalid-id');
  
//       expect(response.status).toBe(400);
//       expect(response.body).toEqual({
//         error: 'Invalid userId. Must be a number.',
//       });
//     });
//     // Test 404 user not found
//     test('should return 404 if the user is not found', async () => {
//       User.findOneAndDelete.mockResolvedValue(null);
  
//       const response = await request(appForDeletingUser).delete('/users/999');
//       expect(response.status).toBe(404);
//       expect(response.body).toEqual({
//         error: 'User not found',
//       });
//     });
//     // Test 500 server error occurs
//     test('should return 500 if a server error occurs', async () => {
//       User.findOneAndDelete.mockRejectedValue(new Error('Database error'));
  
//       const response = await request(appForDeletingUser).delete('/users/100');
//       expect(response.status).toBe(500);
//       expect(response.body).toEqual({
//         error: 'Internal Server Error',
//         detail: 'Database error',
//       });
//     });
//   });