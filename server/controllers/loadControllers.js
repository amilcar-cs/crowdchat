const User = require('../models/User');

async function getPublicRooms(req, res) {
    const userId = req.params.userId;
    try {
        const results = await User.findPublicRooms(userId);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving public rooms from the database: ' + error.stack);
        res.status(500).send('Internal server error');
    }
}

async function getMyChannels(req, res) {
    const userId = req.params.userId;
    try {
        const results = await User.findChannels(userId);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving user rooms from the database: ' + error.stack);
        res.status(500).send('Internal server error');
    }
}

async function getMyPersonalMsg(req, res) {
    const userId = req.params.userId;
    try {
        const results = await User.findDirectRooms(userId);
        res.json(results);
    } catch (error) {
        console.error('Error retrieving user chats from the database: ' + error.stack);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getPublicRooms,
    getMyChannels,
    getMyPersonalMsg,
};
