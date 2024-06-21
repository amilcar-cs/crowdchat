const express = require('express');
const router = express.Router();

// Import route controllers
const messagesController = require('../controllers/messagesControllers');

// Import Middleware to verify JWT token
const verifyToken = require('../middleware/verifyToken');

router.get('/room/:roomid', verifyToken, messagesController.getRoomMessages);
router.get('/user/:chatid', verifyToken, messagesController.getPersonalMessages);

module.exports = router;