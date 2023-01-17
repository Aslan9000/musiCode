const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const midiController = require('./controllers/midiController');

// User related routes
router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/doesUsernameExist', userController.doesUsernameExist);
router.post('/doesEmailExist', userController.doesEmailExist);
router.post('/createAvatar', userController.createAvatar);

// Midi related routes
router.post('/musicify', midiController.wordToMidi);


module.exports = router