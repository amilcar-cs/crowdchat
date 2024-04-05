const DirectChat = require('../models/DirectChat');
const RoomChat = require('../models/RoomChat');

async function getRoomMessages(req, res) {
    try {
        const roomId = req.params.roomid;
        const messages = await RoomChat.findMsgById(roomId);
        res.json(messages);
    } catch (error) {
        console.error('Error al recuperar mensajes de la base de datos: ' + error.stack);
        res.status(500).send('Error interno del servidor');
    }
}

async function getPersonalMessages(req, res) {
    try {
        const chatId = req.params.chatid;
        const messages = await DirectChat.findMsgById(chatId);
        res.json(messages);
    } catch (error) {
        console.error('Error al recuperar mensajes de la base de datos: ' + error.stack);
        res.status(500).send('Error interno del servidor');
    }
}

module.exports = {
    getRoomMessages,
    getPersonalMessages,
}