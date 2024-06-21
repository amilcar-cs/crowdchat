const User = require('../models/User')

// Middleware for Socket.IO authentication
module.exports = async (socket, next) => {
    const username = socket.handshake.headers['username'];
    
    try {
        const user = await User.find(username);
        if (!user) {
            console.log("Not authenticated due to: user not found");
            return next(new Error("User not found"));
        }
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return next(error);
    }
};