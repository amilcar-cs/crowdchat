const express = require('express');
const router = express.Router();

// Importar controladores de rutas
const loadController = require('../controllers/loadControllers');

// Importar el Middleware para verificar el token JWT
const verifyToken = require('../middleware/verifyToken');

router.get('/public-rooms/:userId',verifyToken,loadController.getPublicRooms);
router.get('/user-rooms/:userId',verifyToken, loadController.getMyChannels);
router.get('/user-chats/:userId',verifyToken,loadController.getMyPersonalMsg);

module.exports = router;