const dbConnection = require('../config/database');

class DirectChat {
    static async findRoomById(username, globalUsername) {
        const sql = 'SELECT id FROM personal_room WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)';
        try {
            const results = await dbConnection.queryAsync(sql, [username, globalUsername, globalUsername, username]);
            if (results.length > 0) {
                return results[0].id;
            } else {
                const errorMessage = 'The ID of the existing personal_room relationship could not be found.';
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error getting the ID of the personal_room relationship:', error);
            throw error;
        }
    }

    static async findMsgById(chatId) {
        const query = 'SELECT * FROM personal_messages WHERE chat_id = ?';
        try {
            const results = await dbConnection.queryAsync(query, [chatId]);
            return results;
        } catch (error) {
            console.error('Error when searching for personal messages by chat ID:', error);
            throw error;
        }
    }

    static async createMsg(chatId, sender, message, time) {
        const sql = `
        INSERT INTO personal_messages (chat_id, sender, message, pos, htime)
        SELECT ?, ?, ?, IFNULL(MAX(pos), 0) + 1 AS new_position, ?
        FROM personal_messages
        WHERE chat_id = ?`;
        try {
            const results = await dbConnection.queryAsync(sql, [chatId, sender, message, time, chatId]);
            return results;
        } catch (error) {
            console.error('Error creating a new personal message:', error);
            throw error;
        }
    }

    static async createRoom(username1, username2) {
        const id = `${username1}-${username2}`;
        const sql = 'INSERT INTO personal_room (id, user_id_1, user_id_2) VALUES (?, ?, ?)';
        try {
            await dbConnection.queryAsync(sql, [id, username1, username2]);
            return id;
        } catch (error) {
            console.error('Error creating the personal_room relationship:', error);
            throw error;
        }
    }

    static async between(username1, username2) {
        try {
            const results = await dbConnection.queryAsync('SELECT * FROM personal_room WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)', [username1, username2, username2, username1]);
            return results.length > 0;
        } catch (error) {
            console.error('Error when checking if the personal_room relationship exists:', error);
            throw error;
        }
    }
}

module.exports = DirectChat;
