const User = require('../models/User');
const DirectChat = require('../models/DirectChat');
const RoomChat = require('../models/RoomChat');

module.exports = function(io) {
    // <-- Switch to DirectChat and RoomChat

    async function verifyAndCreateRelationship(username, globalUsername) {
        try {
            const userExists = await User.find(username);
            if (!userExists) {
                console.log('The user does not exist in the database.');
                return;
            }
    
            const relationshipExists = await DirectChat.between(username, globalUsername);
            if (relationshipExists) {
                console.log('There is a personal_room relationship between ', username, ' and ', globalUsername);
                const id = await DirectChat.findRoomById(username, globalUsername);
                console.log('ID de la relación personal_room:', id);
                return { id: id, isNew: false };
            } else {
                console.log('There is no personal_room relationship between ', username, ' and ', globalUsername);
                const id = await DirectChat.createRoom(username, globalUsername);
                console.log('Personal_room relationship created with ID: ', id);
                return { id: id, isNew: true };
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Socket.io connection event
    io.on("connection", function(socket){
        // Event for a new user
        socket.on("newuser",function(username){
            socket.join(username);
        });
    
        // Event for when a user exits
        socket.on("exituser",function(username){
            io.to(username).emit('logout', 'auth/logout');
            setTimeout(function() {
                socket.broadcast.to(username).emit('refresh', '/');
            }, 1000); // 1000 milliseconds = 1 second
            socket.disconnect(true);
        });
    
        // Chat event
        socket.on("chat", async (msg, chatId, type) => {
            if (type == 1){
                await DirectChat.createMsg(chatId, msg.username, msg.text, msg.time);
            } else {
                await RoomChat.createMsg(chatId, msg.username, msg.text, msg.time);
            }
            socket.broadcast.to(chatId).emit('chat', msg);
        });
    
        // Event to create a room
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
                const { id, isNew } = await verifyAndCreateRelationship(username, user);
                if (id) {
                    socket.leave(lastchatid);
                    socket.join(id);
                    if (isNew) {
                        // Issue a custom event to the user 'username' to use the function 'updateMyDirectMsg'.
                        io.to(user).emit('new-direct-message', user);
                        io.to(username).emit('new-direct-message', username);
                    }
                    socket.emit('userchat-id', true, id);
                } else {
                    socket.emit('userchat-id', false, {});
                }
            } catch (error) {
                console.error('Error in verifying and creating the relationship: ', error);
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
                    console.log('No room found with the provided ID');
                }
            } catch (error) {
                socket.emit('data-chat', false, {});
                console.error('Error retrieving room data: ', error);
            }
        });
    });
};