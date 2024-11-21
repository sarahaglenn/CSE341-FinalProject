const User = require('../models/user-model');
// const { ObjectId } = require('mongodb');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users', detail: error.message });
  }
};

const getUserById = async (req, res) => {
  // I initially wrote this for search by _id rather than the manually entered UserID
  // I either need to update swagger.json, or rewrite this validation in another way.

  // if (!ObjectId.isValid(req.params.userId)) {
  //   return res.status(400).json({ error: 'Must use a valid user id to find a user.' });
  // }
  const userId = req.params.userId;
  try {
    const user = await User.find({ UserID: userId });
    if (user.length > 0) {
      // res.setHeader('Content-Type', 'application/json');
      res.status(200).json(user[0]);
    } else {
      res.status(404).json({ error: 'No user exists with that id' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user.', detail: error.message });
  }
};

const getUserByType = async (req, res) => {
  if (
    !(req.params.userType.toLowerCase() == 'patron' || req.params.userType.toLowerCase() == 'staff')
  ) {
    return res.status(400).json({ error: 'Must use a valid user type to find a user.' });
  }
  const userType = req.params.userType.toLowerCase();
  try {
    const users = await User.find({ UserType: { $regex: new RegExp(`^${userType}$`, 'i') } });
    if (users.length > 0) {
      // res.setHeader('Content-Type', 'application/json');
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'No users exist with that user type.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users.', detail: error.message });
  }
};

const createUser = async (req, res) => {
  const user = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    UserType: req.body.UserType, 
    MailingAddress: req.body.MailingAddress    
  };

  const result = await User.create(user);
  console.log(result);


  if(result._id != null){
    res.status(200).json(user);
  } else {
    res.status(500).json(response.error || "Some error occured while adding the user");
  }
}

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
