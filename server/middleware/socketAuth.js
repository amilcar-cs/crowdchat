const User = require('../models/User')

// Middleware para la autenticación de Socket.IO
module.exports = async (socket, next) => {
    const username = socket.handshake.headers['username'];
    
    try {
        const user = await User.find(username);
        if (!user) {
            console.log("No autenticado debido a: usuario no encontrado");
            return next(new Error("Usuario no encontrado"));
        }
        next();
    } catch (error) {
        console.error("Error de autenticación:", error);
        return next(error);
    }
};