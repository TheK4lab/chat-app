const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user');

router.post('/signup', userController.SignUp);

router.post('/login', userController.Login);

// To test this route on Postman, we need to pass the user's token on the Authorization tab
router.post('/logout', auth, userController.Logout);

module.exports = router;