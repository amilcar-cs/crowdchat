const dbConnection = require('../config/database');

class DirectChat {
    static async findRoomById(username, usernameGlobal) {
        const sql = 'SELECT id FROM personal_room WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)';
        try {
            const results = await dbConnection.queryAsync(sql, [username, usernameGlobal, usernameGlobal, username]);
            if (results.length > 0) {
                return results[0].id;
            } else {
                const errorMessage = 'No se pudo encontrar el ID de la relación personal_room existente.';
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error al obtener el ID de la relación personal_room:', error);
            throw error;
        }
    }

    static async findMsgById(chatId) {
        const query = 'SELECT * FROM personal_messages WHERE chat_id = ?';
        try {
            const results = await dbConnection.queryAsync(query, [chatId]);
            return results;
        } catch (error) {
            console.error('Error al buscar mensajes personales por ID de chat:', error);
            throw error;
        }
    }

    static async createMsg(chatId, sender, message) {
        const sql = `
        INSERT INTO personal_messages (chat_id, sender, message, pos, hora)
        SELECT ?, ?, ?, IFNULL(MAX(pos), 0) + 1 AS nueva_posicion, DATE_FORMAT(NOW(), '%H:%i')
        FROM personal_messages
        WHERE chat_id = ?`;
        try {
            const results = await dbConnection.queryAsync(sql, [chatId, sender, message, chatId]);
            return results;
        } catch (error) {
            console.error('Error al crear un nuevo mensaje personal:', error);
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
            console.error('Error al crear la relación personal_room:', error);
            throw error;
        }
    }

    static async between(username1, username2) {
        try {
            const results = await dbConnection.queryAsync('SELECT * FROM personal_room WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)', [username1, username2, username2, username1]);
            return results.length > 0;
        } catch (error) {
            console.error('Error al verificar si la relación personal_room existe:', error);
            throw error;
        }
    }
}

module.exports = DirectChat;
