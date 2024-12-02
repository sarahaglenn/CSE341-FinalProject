const router = require('express').Router();
const usersController = require('../controllers/users.js');
const auth = require('../middleware/auth.js');

router.get('/', auth, usersController.getUsers);

router.get('/:userId', auth, usersController.getUserById);

router.get('/type/:userType', auth, usersController.getUserByType);

router.post('/', auth, usersController.createUser);

// New PUT route to update a user
router.put('/:userId', auth, usersController.updateUser);

// New DELETE route to delete a user
router.delete('/:userId', auth, usersController.deleteUser);

module.exports = router;
