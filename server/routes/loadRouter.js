const express = require('express');
const router = express.Router();

// Import route controllers
const loadController = require('../controllers/loadControllers');

// Import Middleware to verify JWT token
const verifyToken = require('../middleware/verifyToken');

router.get('/public-rooms/:userId',verifyToken,loadController.getPublicRooms);
router.get('/user-rooms/:userId',verifyToken, loadController.getMyChannels);
router.get('/user-chats/:userId',verifyToken,loadController.getMyPersonalMsg);

module.exports = router;