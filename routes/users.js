const router = require('express').Router();

const usersController = require('../controllers/users.js');
// const validation = require('../middleware/validate.js'); //commented out until we've implemented these
// const auth = require('../controllers/auth.js');

router.get('/', usersController.getUsers);

router.get('/:userId', usersController.getUserById);

router.get('/:userType', usersController.getUserByType);

router.get('/login', usersController.userLogin);

router.get('/logout', usersController.userLogout);

module.exports = router;
