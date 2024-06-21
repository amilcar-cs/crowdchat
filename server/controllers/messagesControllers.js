const DirectChat = require('../models/DirectChat');
const RoomChat = require('../models/RoomChat');

async function getRoomMessages(req, res) {
    try {
        const roomId = req.params.roomid;
        const messages = await RoomChat.findMsgById(roomId);
        res.json(messages);
    } catch (error) {
        console.error('Error retrieving messages from the database: ' + error.stack);
        res.status(500).send('Internal server error');
    }
}

async function getPersonalMessages(req, res) {
    try {
        const chatId = req.params.chatid;
        const messages = await DirectChat.findMsgById(chatId);
        res.json(messages);
    } catch (error) {
        console.error('Error retrieving messages from the database: ' + error.stack);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getRoomMessages,
    getPersonalMessages,
}