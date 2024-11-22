const User = require('../models/user-model');
// const { ObjectId } = require('mongodb');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  // Validate userId
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid UserID. Must be a number.' });
  }

  try {
    const user = await User.find({ UserID: userId });
    if (user.length > 0) {
      res.status(200).json(user[0]);
    } else {
      res.status(404).json({ error: 'No user exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const getUserByType = async (req, res) => {
  const validTypes = new Set(['patron', 'staff']);
  const userType = req.params.userType.toLowerCase();
  if (!validTypes.has(userType)) {
    return res.status(400).json({ error: 'Must use a valid user type to find a user.' });
  }
  try {
    const users = await User.find({ UserType: { $regex: new RegExp(`^${userType}$`, 'i') } });
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'No users exist with that user type.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};

const createUser = async (req, res) => {
  const user = {
    UserID: req.body.UserID,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    UserType: req.body.UserType,
    MailingAddress: req.body.MailingAddress
  };

  const result = await User.create(user);
  console.log(result)

  if (result._id != null) {
    res.status(200).json(user);
  } else {
    res.status(500).json(response.error || 'Some error occurred while adding the user');
  }
};

// const userLogin = async (req, res) => {}; // not yet implemented. Should these routes be in auth folder instead?
// const userLogout = async (req, res) => {};

module.exports = {
  getUsers,
  getUserById,
  getUserByType,
  createUser
  // userLogin, // not yet implemented
  // userLogout
};
