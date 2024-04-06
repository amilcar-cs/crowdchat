const User = require('../models/User');
const DirectChat = require('../models/DirectChat');
const RoomChat = require('../models/RoomChat');

module.exports = function(io) {
    // <-- Pasar a DirectChat y RoomChat

    async function verificarYCrearRelacion(username, usernameGlobal) {
        try {
            const usuarioExiste = await User.find(username);
            if (!usuarioExiste) {
                console.log('El usuario no existe en la base de datos.');
                return;
            }
    
            const existeRelacion = await DirectChat.between(username, usernameGlobal);
            if (existeRelacion) {
                console.log('Existe una relación personal_room entre', username, 'y', usernameGlobal);
                const id = await DirectChat.findRoomById(username, usernameGlobal);
                console.log('ID de la relación personal_room:', id);
                return { id: id, isNew: false };
            } else {
                console.log('No existe una relación personal_room entre', username, 'y', usernameGlobal);
                const id = await DirectChat.createRoom(username, usernameGlobal);
                console.log('Relación personal_room creada con ID:', id);
                return { id: id, isNew: true };
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Evento de conexión de Socket.io
    io.on("connection", function(socket){
        // Evento para un nuevo usuario
        socket.on("newuser",function(username){
            socket.join(username);
        });
    
        // Evento para cuando un usuario sale
        socket.on("exituser",function(username){
            io.to(username).emit('logout', 'auth/logout');
            setTimeout(function() {
                // Aquí va el código que deseas ejecutar después de esperar 1 segundo
                socket.broadcast.to(username).emit('refresh', '/');
            }, 1000); // 1000 milisegundos = 1 segundo
            socket.disconnect(true);
        });
    
        // Evento de chat
        socket.on("chat", async (msg, chatId, type) => {
            if (type == 1){
                await DirectChat.createMsg(chatId, msg.username, msg.text);
                //await agregarMensajePersonal(chatId, msg.username, msg.text);
            } else {
                await RoomChat.createMsg(chatId, msg.username, msg.text);
            }
            socket.broadcast.to(chatId).emit('chat', msg);
        });
    
        // Evento para crear una sala
        socket.on('create room', async ({ roomName, desc, option }, user, lastchatid) => {
            const roomData = {
                name: roomName,
                description: desc,
                creator: user,
                private: option
            };

            const roomId = await RoomChat.createRoom(roomData);
            await RoomChat.joinRoom(user,roomId);

            socket.leave(lastchatid);
            socket.join(roomId);
            socket.emit("room-id",roomId);
        });
    
        socket.on('direct message', async function(username, user, lastchatid) {
            try {
                const { id, isNew } = await verificarYCrearRelacion(username, user);
                if (id) {
                    socket.leave(lastchatid);
                    socket.join(id);
                    if (isNew) {
                        // Emitir un evento personalizado al usuario 'username' para que utilice la función 'updateMyDirectMsg'
                        io.to(user).emit('new-direct-message', user);
                        io.to(username).emit('new-direct-message', username);
                    }
                    socket.emit('userchat-id', true, id);
                } else {
                    socket.emit('userchat-id', false, {});
                }
            } catch (error) {
                console.error('Error al verificar y crear la relación:', error);
                socket.emit('userchat-id', false, {});
            }
        });
        
        socket.on('join room', async function(chatId, user, lastchatid){
            try {
                const room = await RoomChat.findRoomById(chatId);
                if (room) {
                    const count = await RoomChat.isUserInRoom(user,room.id);
                    if (!count) {
                        await RoomChat.joinRoom(user,room.id);
                        socket.broadcast.to(room.id).emit("update", user + " joined the conversation");
                    }

                    socket.leave(lastchatid);
                    socket.join(room.id);
                    socket.emit('data-chat', true, {id: room.id, name: room.name, description: room.description, creator: room.creator, private: room.private});
                } else {
                    socket.emit('data-chat', false, {});
                    console.log('No se encontró ningún room con el ID proporcionado');
                }
            } catch (error) {
                socket.emit('data-chat', false, {});
                console.error('Error al recuperar los datos del room:', error);
            }
        });
    });
};