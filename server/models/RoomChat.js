const dbConnection = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Función para generar un ID corto único
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
        console.error('Error al generar un ID corto único:', error);
        throw error;
    }
}

// Definir modelo de usuario y tokens de actualización
class RoomChat {
    static async findRoomById(shortId) {
        const consulta = 'SELECT * FROM rooms WHERE id = ?';
        try {
            const results = await dbConnection.queryAsync(consulta, [shortId]);
            return results.length === 0 ? false : results[0];
        } catch (error) {
            console.error('Error al obtener la sala por ID:', error);
            throw error;
        }
    }

    static async findMsgById(roomId) {
        const query = `SELECT * FROM room_messages WHERE room_id = ?`;
        try {
            const results = await dbConnection.queryAsync(query, [roomId]);
            return results;
        } catch (error) {
            console.error('Error al buscar mensajes personales por ID de chat:', error);
            throw error;
        }
    }

    static async createMsg(chatId, sender, message, time) {
        const sql = `
        INSERT INTO room_messages (room_id, sender, message, pos, hora)
        SELECT ?, ?, ?, IFNULL(MAX(pos), 0) + 1 AS nueva_posicion, ?
        FROM room_messages
        WHERE room_id = ?`;
        try {
            const results = await dbConnection.queryAsync(sql, [chatId, sender, message, time, chatId]);
            return results;
        } catch (error) {
            console.error('Error al agregar un nuevo mensaje grupal:', error);
            throw error;
        }
    }

    static async createRoom(roomData) {
        try {
            const roomId = await generateUniqueShortId();
            const query = 'INSERT IGNORE INTO rooms (id, name, description, creator, private) VALUES (?, ?, ?, ?, ?)';
            const results = await dbConnection.queryAsync(query, [roomId, roomData.name, roomData.description, roomData.creator, roomData.private]);
            if (results.affectedRows === 0) {
                console.log("La sala ya existe.");
                return null; // Retorna null para indicar que no se creó una nueva sala
            }
            console.log("Sala creada");
            return roomId;
        } catch (error) {
            console.error('Error al crear una nueva sala:', error);
            throw error;
        }
    }

    static async joinRoom(username, roomId) {
        const sql = 'INSERT INTO room_participants (user_id, room_id) VALUES (?, ?)';
        try {
            const results = await dbConnection.queryAsync(sql, [username, roomId]);
            return results;
        } catch (error) {
            console.error('Error al agregar un nuevo participante a la sala:', error);
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
            console.error('Error al verificar si el usuario está en la sala:', error);
            throw error;
        }
    }
}

// Exportar modelo de usuario y tokens de actualización
module.exports = RoomChat;
