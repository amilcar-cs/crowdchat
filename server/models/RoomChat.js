const dbConnection = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Function to generate a unique short ID
async function generateUniqueShortId() {
    let uuid = uuidv4();
    let shortId = Buffer.from(uuid, 'hex').toString('base64').slice(0, 8);
    shortId = shortId.replace(/\//g, '$').replace(/\\/g, '$');

    try {
        const room = await RoomChat.findRoomById(shortId);
        if (room) {
            return await generateUniqueShortId();
        } else {
            return shortId;
        }
    } catch (error) {
        console.error('Error generating a unique short ID:', error);
        throw error;
    }
}

// Define user model and update tokens
class RoomChat {
    static async findRoomById(shortId) {
        const query = 'SELECT * FROM rooms WHERE id = ?';
        try {
            const results = await dbConnection.queryAsync(query, [shortId]);
            return results.length === 0 ? false : results[0];
        } catch (error) {
            console.error('Error getting the room by ID:', error);
            throw error;
        }
    }

    static async findMsgById(roomId) {
        const query = `SELECT * FROM room_messages WHERE room_id = ?`;
        try {
            const results = await dbConnection.queryAsync(query, [roomId]);
            return results;
        } catch (error) {
            console.error('Error when searching for personal messages by chat ID:', error);
            throw error;
        }
    }

    static async createMsg(chatId, sender, message, time) {
        const sql = `
        INSERT INTO room_messages (room_id, sender, message, pos, htime)
        SELECT ?, ?, ?, IFNULL(MAX(pos), 0) + 1 AS new_position, ?
        FROM room_messages
        WHERE room_id = ?`;
        try {
            const results = await dbConnection.queryAsync(sql, [chatId, sender, message, time, chatId]);
            return results;
        } catch (error) {
            console.error('Error adding a new group message:', error);
            throw error;
        }
    }

    static async createRoom(roomData) {
        try {
            const roomId = await generateUniqueShortId();
            const query = 'INSERT IGNORE INTO rooms (id, name, description, creator, private) VALUES (?, ?, ?, ?, ?)';
            const results = await dbConnection.queryAsync(query, [roomId, roomData.name, roomData.description, roomData.creator, roomData.private]);
            if (results.affectedRows === 0) {
                console.log("The room already exists.");
                return null; // Returns null to indicate that a new room was not created.
            }
            console.log("Room successfully created.");
            return roomId;
        } catch (error) {
            console.error('Error creating a new room:', error);
            throw error;
        }
    }

    static async joinRoom(username, roomId) {
        const sql = 'INSERT INTO room_participants (user_id, room_id) VALUES (?, ?)';
        try {
            const results = await dbConnection.queryAsync(sql, [username, roomId]);
            return results;
        } catch (error) {
            console.error('Error when adding a new participant to the room:', error);
            throw error;
        }
    }

    static async isUserInRoom(userId, roomId) {
        const selectSql = 'SELECT COUNT(*) AS count FROM room_participants WHERE user_id = ? AND room_id = ?';
        try {
            const results = await dbConnection.queryAsync(selectSql, [userId, roomId]);
            const count = results[0].count;
            return count > 0;
        } catch (error) {
            console.error('Error when checking if the user is in the room:', error);
            throw error;
        }
    }
}

// Export user model and update tokens
module.exports = RoomChat;
