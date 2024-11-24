const router = require('express').Router();

const usersController = require('../controllers/users.js');
// const validation = require('../middleware/validate.js'); //commented out until we've implemented these
// const auth = require('../controllers/auth.js');

router.get('/', usersController.getUsers);

router.get('/:userId', usersController.getUserById);

router.get('/type/:userType', usersController.getUserByType);

router.post('/', usersController.createUser);
// router.get('/login', usersController.userLogin); not yet implemented

// router.get('/logout', usersController.userLogout); //not yet implemented

// New PUT route to update a user
router.put('/:userId', usersController.updateUser);

// New DELETE route to delete a user
router.delete('/:userId', usersController.deleteUser);


module.exports = router;
