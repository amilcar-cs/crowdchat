const dbConnection = require('../config/database');

class User {
  static async getAllUsers() {
    try {
      const results = await dbConnection.queryAsync('SELECT * FROM users');
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByUsername(username) {
    try {
      const results = await dbConnection.queryAsync('SELECT * FROM users WHERE username = ?', [username]);
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  static async find(username) {
    try {
      const results = await dbConnection.queryAsync('SELECT * FROM users WHERE username = ?', [username]);
      if (results[0]) {
        return results[0];
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  static async create(username, password) {
    try {
      const results = await dbConnection.queryAsync('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
      return results.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserPassword(username, newPassword) {
    try {
      await dbConnection.queryAsync('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
    } catch (error) {
      throw error;
    }
  }

  static async deleteRefreshToken(username) {
    try {
      await dbConnection.queryAsync('DELETE FROM refresh_tokens WHERE username = ?', [username]);
    } catch (error) {
      throw error;
    }
  }

  static async saveRefreshToken(username, refreshToken) {
    try {
      const results = await dbConnection.queryAsync('INSERT INTO refresh_tokens (username, refresh_token) VALUES (?, ?)', [username, refreshToken]);
      return results.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findChannels(userId) {
    try {
      const query = `
        SELECT rooms.*, room_participants.user_id AS participant_user_id
        FROM rooms
        INNER JOIN room_participants ON rooms.id = room_participants.room_id
        WHERE room_participants.user_id = ?
      `;
      const results = await dbConnection.queryAsync(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async findPublicRooms(userId) {
    try {
      const query = `
        SELECT rooms.*, COUNT(room_participants.user_id) AS user_count
        FROM rooms
        LEFT JOIN room_participants ON rooms.id = room_participants.room_id
        WHERE rooms.private = 0 AND rooms.id NOT IN (
            SELECT room_id FROM room_participants WHERE user_id = ?
        )
        GROUP BY rooms.id
      `;
      const results = await dbConnection.queryAsync(query, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async findDirectRooms(userId) {
    try {
      const query = `
        SELECT id, CASE
            WHEN user_id_1 = ? THEN user_id_2
            ELSE user_id_1
        END AS other_user_id
        FROM personal_room
        WHERE user_id_1 = ? OR user_id_2 = ?
      `;
      const results = await dbConnection.queryAsync(query, [userId, userId, userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;