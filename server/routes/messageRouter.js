const express = require('express');
const router = express.Router();

// Importar controladores de rutas
const messagesController = require('../controllers/messagesControllers');

// Importar el Middleware para verificar el token JWT
const verifyToken = require('../middleware/verifyToken');


router.get('/room/:roomid', verifyToken, messagesController.getRoomMessages);
router.get('/user/:chatid', verifyToken, messagesController.getPersonalMessages);

module.exports = router;