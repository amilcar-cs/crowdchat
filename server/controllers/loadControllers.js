const User = require('../models/User');

async function getPublicRooms(req, res) {
    const userId = req.params.userId;
    try {
        const results = await User.findPublicRooms(userId);
        res.json(results);
    } catch (error) {
        console.error('Error al recuperar las salas públicas de la base de datos: ' + error.stack);
        res.status(500).send('Error interno del servidor');
    }
}

async function getMyChannels(req, res) {
    const userId = req.params.userId;
    try {
        const results = await User.findChannels(userId);
        res.json(results);
    } catch (error) {
        console.error('Error al recuperar las salas del usuario de la base de datos: ' + error.stack);
        res.status(500).send('Error interno del servidor');
    }
}

async function getMyPersonalMsg(req, res) {
    const userId = req.params.userId;
    try {
        const results = await User.findDirectRooms(userId);
        res.json(results);
    } catch (error) {
        console.error('Error al recuperar los chats del usuario de la base de datos: ' + error.stack);
        res.status(500).send('Error interno del servidor');
    }
}

module.exports = {
    getPublicRooms,
    getMyChannels,
    getMyPersonalMsg,
};
