// UI: Responsive chat layout and interactions
function verifyScreenSize() {
    var rightBar = document.querySelector('.right-bar');
    if (window.getComputedStyle(rightBar).display === 'flex') {
        if (window.innerWidth > 765 && window.innerWidth < 1155 ){
            document.querySelector('.left-bar').style.display = "none";
            document.querySelector('.chat-screen').style.display = "";
            document.getElementById("to-right").style.display = "none";
        } else {
            if (window.innerWidth < 765) {
                document.querySelector('.chat-screen').style.display = "none";
            } else {
                document.querySelector('.chat-screen').style.display = "";
                document.querySelector('.left-bar').style.display = "";
            }
        }
    }
}

// UI: button window interactions and dark mode
document.addEventListener("DOMContentLoaded", function() {
    var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    const toLeftButton = document.getElementById("to-left");
    const leftBar = document.querySelector(".left-bar");
    const chatScreen = document.querySelector(".chat-screen");
    const toRightButton = document.getElementById("to-right");
    const rightBar = document.querySelector(".right-bar");

    toLeftButton.addEventListener("click", function() {
        leftBar.style.display = "flex";
        chatScreen.style.display = "none";
        rightBar.style.display = "";
    });

    const LefttoRightButton = document.getElementById("left-to-right");
    LefttoRightButton.addEventListener("click", function() {
        leftBar.style.display = "";
        chatScreen.style.display = "";
    });

    
    toRightButton.addEventListener("click", function() {
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        rightBar.style.display = "flex";
        if (screenWidth < 765){
            chatScreen.style.display = "none";
        } else {
            leftBar.style.display = "none";
            toRightButton.style.display="none";
        }
    });

    const RighttoLeftButton = document.getElementById("right-to-left");
    RighttoLeftButton.addEventListener("click", function() {
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        rightBar.style.display = "";
        if (screenWidth < 765){
            chatScreen.style.display = "";
            toRightButton.style.display="";
            leftBar.style.display = "";
        } else {
            leftBar.style.display = "";
            toRightButton.style.display="";
        }
    });

    const botonDrkMode = document.querySelector('.drkmode');

    botonDrkMode.addEventListener('click', function() {
        const lgtElement = document.getElementById('lgt');
        const drkElement = document.getElementById('drk');
        const body = document.body;
        if (lgtElement.style.display === 'none') {
            lgtElement.style.display = 'block';
            drkElement.style.display = 'none';
            // Agregar clase "dark-mode" y quitar clase "light-mode"
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        } else {
            lgtElement.style.display = 'none';
            drkElement.style.display = 'block';
            // Agregar clase "light-mode" y quitar clase "dark-mode"
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
    });
});

// Trigger: when screen sizes change, launch this function.
window.onload = verifyScreenSize;
window.addEventListener('resize', verifyScreenSize);

const UIController = (function() {
    var app = document.querySelector(".app");
    let mychannelsContainer = document.getElementById("channels");
    let mydirectmsgContainer = document.getElementById("direct-msg");
    let messageContainer = app.querySelector(".chat-screen .messages");
    let publicRoomContainer = app.querySelector(".right-bar .contents");
    var formBox = document.getElementById("new-room-form");
    var openFormBtn = document.getElementById("up-room-form");
    var closeFormBtn = document.getElementById("cancel-form");
    
    // UI: Opens or closes the form to create a new room.
    function openForm(){
        openFormBtn.addEventListener("click", function() {
            if (formBox.style.display === "block"){
                formBox.style.display = "none";
            } else {
                formBox.style.display = "block";
            }
        });
    }

    // UI: Closes the tab to create a new room.
    function closeForm(){
        closeFormBtn.addEventListener("click", function(event) {
            event.preventDefault();
            formBox.style.display = "none";
        });
    }

    // UI: Retrieves the user's username.
    function getAppUsername() {
        var username = app.getAttribute("data-username");
        if (username.length == 0) {
            return;
        }
        return username;
    }

    // UI: Evaluates if the form to create a new room is active or not.
    function isFormActive() {
        var form = document.getElementById("new-room-form");
        return form.style.display === "block"; // Assuming the form is activated with display block
    }

    // UI: Obtains the values from the form to create a new room.
    function getFormData() {
        // Get references to the form elements
        var newNameInput = document.getElementById("new-room-name");
        var newDescriptionInput = document.getElementById("new-room-description");
        var optionInputs = document.getElementsByName("option");

        // Get the value of the name and description
        var newName = newNameInput.value;
        var newDescription = newDescriptionInput.value;

        // Get the selected option
        var selectedOption;
        for (var i = 0; i < optionInputs.length; i++) {
            if (optionInputs[i].checked) {
                selectedOption = optionInputs[i].value;
                break;
            }
        }

        // Return an object with the form values
        return {
            newName: newName,
            newDescription: newDescription,
            selectedOption: selectedOption
        };
    }

    // UI: Cleans the current messages.
    function cleanMessages(){
        messageContainer.innerHTML = " ";
    }

    // UI: Function that modifies the user's icon
    function changeContentCircle(text) {
        var firstLetter = text.charAt(0).toUpperCase();
        var lastLetter = text.charAt(text.length - 1).toUpperCase();
        var newContent = firstLetter + lastLetter;
        var circle = document.querySelector(".circle");

        // Change the content of the element
        circle.textContent = newContent;
    }

    // UI: Updates the current messages to display them on the screen.
    function updateMessages(messages,username,type) {
        try {
            messageContainer.innerHTML = ""; // Clean the message container
            messages.forEach(message => {
                // Determine whether the message is from the current user or from another user and render it accordingly
                if (message.sender == username) {
                    renderMessage("my", type, {
                        username: message.sender,
                        text: message.message,
                        time: message.htime.substring(0, 5)
                    });
                } else {
                    renderMessage("other", type, {
                        username: message.sender,
                        text: message.message,
                        time: message.htime.substring(0, 5)
                    });
                }
            });
        } catch (error) {
            console.error('Error updating the user interface:', error);
        }
    }

    // UI: Displays a message received by the server.
    function handleChatMessage(message,username,type) {
        const messageType = message.username === username ? "my" : "other";
        renderMessage(messageType, type, message);
    }

    // UI: Displays a message when a user joins the room.
    function handleUpdate(update,type) {
        renderMessage("update", type, update);
    }

    // UI: Updates the left bar information with the user's rooms.
    function updateMyChannelsUI(userRooms) {
        try {
            mychannelsContainer.innerHTML = "";

            // Render each user room in the user interface
            userRooms.forEach(room => {
                renderMyChats("Channel", {
                    id: room.id,
                    name: room.name
                });
            });
        } catch (error) {
            console.error('Error updating the user interface:', error);
        }
    }

    // UI: Updates the information in the left bar with the user's direct chats.
    function updateMyDirectMsgUI(userDirectChats) {
    // Function to update the user interface with information from the user's direct chats
        try {
            mydirectmsgContainer.innerHTML = "";

            // Render each direct chat in the user interface
            userDirectChats.forEach(chat => {
                renderMyChats("Direct", {
                    id: chat.id,
                    name: chat.other_user_id
                });
            });
        } catch (error) {
            console.error('Error updating the user interface:', error);
        }
    }

    // UI: Updates the information in the right bar with the public rooms that the user does not have.
    function updatePublicRoomsUI(publicRoomsData) {
        try {
            publicRoomContainer.innerHTML = "";
    
            // Render each public room in the user interface
            publicRoomsData.forEach(room => {
                renderPublicRoom({
                    name: room.name,
                    id: room.id,
                    creator: room.creator,
                    description: room.description,
                    members: room.user_count
                });
            });
        } catch (error) {
            console.error('Error updating the user interface:', error);
        }
    }

    // UI: Inserts a shortcut to a chat (room or direct) in the left bar.
    function renderMyChats(type, room) {
        // Determine the corresponding container according to the type
        let container = type === "Channel" ? mychannelsContainer : mydirectmsgContainer;

        let chatElement = document.createElement("div");
        let html = type === "Channel"
            ? `<a href="#" class="channel" my-room-id="${room.id}">#${room.name}</a>`
            : `<a href="#" class="direct" my-chat-id="${room.name}">@${room.name}</a>`;
    
        // Set the HTML content of the element
        chatElement.innerHTML = html;
    
        // Add the element to the corresponding container
        container.appendChild(chatElement);
    }        

    // UI: Inserts a public room in the right bar.
    function renderPublicRoom(room) {
        // Create the HTML of the public room element
        let roomHTML = `
            <div class="room-box">
                <h3>${room.name}</h3>
                <div class="room-info">
                    <h4>Created by @${room.creator}</h4>
                    <h4>${room.members} members</h4>
                </div>
                <p class="room-desc">${room.description}</p>
                <button class="join-to-room" public-room-id="${room.id}">Join</button>
            </div>
        `;
    
        // Insert the HTML of the public room element into the public room container
        publicRoomContainer.insertAdjacentHTML('beforeend', roomHTML);
    }    

    // UI: Inserts a message in the message container.
    function renderMessage(type, private, message) {
        // Create a new div element to represent the message
        let messageElement = document.createElement("div");
    
        // Determine the message type according to the type (your own or another user's)
        let messageClass = type === "my" ? "my-message" : type === "other" ? "other-message" : "update";

        // Adding classes to the message element
        messageElement.classList.add(messageClass);
    
        // Build the HTML content of the message
        let innerHTML = `
            <div>
                ${type === "my" && private === 0 ? `<div class="name">You</div>` : ""}
                ${type === "other" && private === 0 ? `<div class="name">${message.username}</div>` : ""}
                <div class="text-box">
                    <p class="text">${message.text}</p>
                    <p class="time">${message.time}</p>
                </div>
            </div>
        `;
    
        // If the message is of type "update" and is not private, the direct content is used instead of a specific format.
        if (type === "update" && !private) {
            innerHTML = message;
        } else {
            messageElement.classList.add("message");
        }
    
        // Add HTML content to the message element
        messageElement.innerHTML = innerHTML;
    
        // Add the message element to the message container
        messageContainer.appendChild(messageElement);

        // Scroll the message container down to show the newly added message
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    return {
        openForm: openForm,
        closeForm: closeForm,
        getAppUsername: getAppUsername,
        isFormActive: isFormActive,
        getFormData: getFormData,
        cleanMessages: cleanMessages,
        changeContentCircle: changeContentCircle,
        updateMessages: updateMessages,
        handleChatMessage: handleChatMessage,
        handleUpdate: handleUpdate,
        updateMyChannelsUI: updateMyChannelsUI,
        updateMyDirectMsgUI: updateMyDirectMsgUI,
        updatePublicRoomsUI: updatePublicRoomsUI,
        renderMessage: renderMessage
    };
})();

const ServiceController = (function(username) {
    // Server: Connects from the user to the server.
    const socket = io({
        extraHeaders: {
            "username": username
        }
    });
    
    // Server: Requests the server to create a new room.
    function createRoom(roomName,desc,option,username,lastchatid){
        socket.emit('create room', {roomName, desc, option}, username, lastchatid);
    }

    // Server: Creates and obtains the id of a new room.
    function handleServerCommunication(formData, username, lastchatid, callback) {
        // Function to handle the communication logic with the server
        createRoom(formData.newName, formData.newDescription, formData.selectedOption, username, lastchatid)

        // Handle server response to obtain the ID of the created room
        socket.on('room-id', (roomId) => {
            callback(roomId);
        });
    }

    // Server: Informs the server of a login
    function login(username){
        socket.emit("newuser",username);
    }
    
    // Server (Send to server): Requests the server to exit the session.
    function exit(username) {
        // Function to interact with the server
        socket.emit("exituser",username);
    }

    // Server (Receive from server): Updates the page.
    function refreshPage(){
        socket.on("refresh",function(){
            window.location.reload(true); // Reload page
        });
    }

    // Server (Receive from server): Get messages from a room.
    function fetchRoomMessages(roomId) {
        return fetch(`/messages/room/${roomId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error getting messages');
                }
                return response.json();
            });
    }

    // Server: Requests the server to join a room.
    function joinToRoom(message, username, lastchatid) {
        // Function to interact with the server
        socket.emit("join room", message, username, lastchatid);
    }

    // Server (Receive from server): Get messages from a direct chat.
    function fetchDirectMessages(chatId) {
        return fetch(`/messages/user/${chatId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error getting messages');
                }
                return response.json();
            });
    }

    // Server: Requests the server to join a direct chat.
    function joinToDirectChat(message, username, lastchatid) {
        // Function to interact with the server
        socket.emit("direct message", message, username, lastchatid);
    }

    // Server: Receives a direct message.
    function newDirectMsg(updateMyDirectMsg){
        socket.on('new-direct-message', updateMyDirectMsg);
    }

    // Server (Send to Server): Sends a message to the server.
    function sendMessageToServer(username, message, currentTime, chatId, type) {
    // Function to interact with the server
        socket.emit("chat", {
            username: username,
            text: message,
            time: currentTime
        }, chatId, type);
    }

    // Server (Sends and receives from server): Requests from the server all the rooms in which a user is present.
    function fetchUserRooms(username) {
    // Function to get the user's room information from the server
        return fetch(`/load/user-rooms/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error obtaining user rooms: ' + response.statusText);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error in the fetch request: ', error);
                return [];
            });
    }

    // Server (Send and receive from server): Requests all direct chats that a user has from the server.
    function fetchUserDirectChats(username) {
    // Function to get the user's direct chats information from the server
        return fetch(`/load/user-chats/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error getting the user's direct chats: " + response.statusText);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error in the fetch request: ', error);
                return [];
            });
    }

    // Server (Send and receive from server): Requests from the server all public rooms in which a user is not present.
    function fetchPublicRoomsData(username) {
        return fetch(`/load/public-rooms/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error in obtaining public rooms: ' + response.statusText);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error in the fetch request: ', error);
                return [];
            });
    }

    // Return of all functions
    return {
        socket: socket,
        handleServerCommunication: handleServerCommunication,
        login: login,
        exit: exit,
        refreshPage: refreshPage,
        fetchRoomMessages: fetchRoomMessages,
        joinToRoom: joinToRoom,
        fetchDirectMessages: fetchDirectMessages,
        joinToDirectChat: joinToDirectChat,
        newDirectMsg: newDirectMsg,
        sendMessageToServer: sendMessageToServer,
        fetchUserRooms: fetchUserRooms,
        fetchUserDirectChats: fetchUserDirectChats,
        fetchPublicRoomsData: fetchPublicRoomsData
    };

})(UIController.getAppUsername());

const main = (function(UIController, ServiceController) {
    var app = document.querySelector(".app");
    var inputMsg = document.getElementById("message-input");
    var roomContainer = document.getElementById('rooms-container');
    var channelsContainer = document.getElementById('channels');
    var directmsgContainer = document.getElementById('direct-msg');
    var createNewRoom = document.getElementById("new-room-form");
    var inputPers = document.getElementById("search-user-id");
    var input = document.getElementById("search-room-id");
    var logoutButton = document.getElementById("logout");

    const {
        openForm,
        closeForm,
        getAppUsername,
        isFormActive,
        getFormData,
        cleanMessages,
        changeContentCircle,
        updateMessages,
        handleChatMessage,
        handleUpdate,
        updateMyChannelsUI,
        updateMyDirectMsgUI,
        updatePublicRoomsUI,
        renderMessage
    } = UIController;

    const {
        socket,
        handleServerCommunication,
        login,
        exit,
        refreshPage,
        fetchRoomMessages,
        joinToRoom,
        fetchDirectMessages,
        joinToDirectChat,
        newDirectMsg,
        sendMessageToServer,
        fetchUserRooms,
        fetchUserDirectChats,
        fetchPublicRoomsData
    } = ServiceController;    

    // Init App: Sets the current chat header.
    const chatHeader = {
        Title: "",
        Code: "",

        // Functions for setting values
        setTitle: function(value) {
            var ttl = value.charAt(0).toUpperCase() + value.slice(1);

            document.getElementById("chat-title").innerHTML = "#"+ttl;
            this.Title = ttl;
        },
        setCode: function(value) {
            document.getElementById("chat-code").innerHTML = value;
            this.Code = value;
        },

        // Functions to obtain values
        getTitle: function() {
            return this.Title;
        },
        getCode: function() {
            return this.Code;
        }
    }

    // Init App: Sets the current values of the session.
    const session = {
        username: "",
        lastChatId: "",
        chatId: "",
        type: "",
        
        // Functions for setting values
        setUsername: function(value) {
        this.username = value;
        },
        setLastChatId: function(value) {
        this.lastChatId = value;
        },
        setChatId: function(value) {
        this.chatId = value;
        },
        setType: function(value) {
        this.type = value;
        },
        
        // Functions to obtain values
        getUsername: function() {
        return this.username;
        },
        getLastChatId: function() {
        return this.lastChatId;
        },
        getChatId: function() {
        return this.chatId;
        },
        getType: function() {
        return this.type;
        }
    };
    
    // Main function that starts the application
    function init() {
        // Configuring user interface events
        setupUIEvents();

        // Configure server events
        setupServiceEvents();   
        
        // Configure application events
        setupAppEvents();

        // Configuring triggers events
        setupTriggerEvents();
    }

    function setupAppEvents(){
        // Init App: Set the initial values of any session.
        session.setUsername(getAppUsername());
        session.setLastChatId("");
        session.setChatId("1SnuCA==");
        session.setType(0);

        // Init App: Sets the user's values when logging in.
        gotoRoom(session.getChatId()).then(function() {
            updatePublicRooms(session.getUsername());
            updateMyChannels(session.getUsername());
            updateMyDirectMsg(session.getUsername());
        });

        // Init UI: Set user icon
        changeContentCircle(session.getUsername());
    }

    function setupUIEvents(){
        // UI Init: Initializes the button for the form that creates a new room.
        openForm();
        // UI Init: Initializes the exit button of the form that creates a new room.
        closeForm();
    }

    function setupServiceEvents(){
        login(getAppUsername());
        refreshPage();
        newDirectMsg(updateMyDirectMsg);
        update(handleUpdate);
        chatting(handleChatMessage,session.getUsername());
    }

    function setupTriggerEvents(){
        // Trigger: Activates the controller to join a public room that has not been joined.
        roomContainer.addEventListener('click', function(event) {
            // Verify if the clicked element is a button
            if (event.target.classList.contains('join-to-room')) {
                // Get the title of the box associated to the clicked button.
                var roomId = event.target.parentNode.querySelector('.join-to-room').getAttribute("public-room-id");
                // Print the title on the console
                gotoRoom(roomId).then(function() {
                    updateMyChannels(session.getUsername());
                    updatePublicRooms(session.getUsername());
                });
                var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                if (screenHeight > 1900 || (screenWidth < 713 && screenHeight < 1900)){
                    document.querySelector(".chat-screen").style.display = "";
                    document.querySelector(".right-bar").style.display = "";
                }
            }
        });

        // Trigger: Activates the controller to join a room that the user has already joined.
        channelsContainer.addEventListener('click', function(event) {
            event.preventDefault();
            // Verify if the clicked element is a button
            if (event.target.classList.contains('channel')) {
                // Get the title of the box associated to the clicked button.
                var roomId = event.target.parentNode.querySelector('.channel').getAttribute("my-room-id");
                if (roomId != session.getChatId()){
                    gotoRoom(roomId);
                }
                var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                if (screenHeight > 1900 || (screenWidth < 713 && screenHeight < 1900)){
                    document.querySelector(".chat-screen").style.display = "";
                    document.querySelector(".left-bar").style.display = "";
                }
            }
        });

        // Trigger: Activates the controller to join a direct chat that the user has already joined.
        directmsgContainer.addEventListener('click', function(event) {
            event.preventDefault();
            // Verify if the clicked element is a button
            if (event.target.classList.contains('direct')) {
                // Get the title of the box associated to the clicked button.
                var roomId = event.target.parentNode.querySelector('.direct').getAttribute("my-chat-id");
                // Print the title on the console
                if (roomId.toLowerCase() != chatHeader.getTitle().toLowerCase()){
                    gotoDirectChat(roomId);
                }
                var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                if (screenHeight > 1900 || (screenWidth < 713 && screenHeight < 1900)){
                    document.querySelector(".chat-screen").style.display = "";
                    document.querySelector(".left-bar").style.display = "";
                }
            }
        });

        // Trigger: Activate the controller to create a new room.
        createNewRoom.addEventListener("submit", function(event) {
            // Adding an event to handle the form when it is submitted
            event.preventDefault(); // Prevent the form from being sent
            handleForm(); // Calling the form handling function
            // Hide the form after processing
            createNewRoom.style.display = "none";
            var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if (screenHeight > 1900 || (screenWidth < 713 && screenHeight < 1900)){
                document.querySelector(".chat-screen").style.display = "";
                document.querySelector(".right-bar").style.display = "";
            }
        });

        // Trigger: Activate the controller to go to a direct chat.
        inputPers.addEventListener("keyup", function(event) {
            var chatID = inputPers.value;
            if (event.key === "Enter") {
                if (chatID.toLowerCase() != chatHeader.getTitle().toLowerCase()){
                    gotoDirectChat(chatID);
                    var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                    if (screenHeight > 1900 || (screenWidth < 713 && screenHeight < 1900)){
                        document.querySelector(".chat-screen").style.display = "";
                        document.querySelector(".left-bar").style.display = "";
                    }
                }
                inputPers.value = "";
            }
        });
        
        // Trigger: Activate the controller to go to a room.
        input.addEventListener("keyup", function(event) {
            var chatID = input.value;
            if (event.key === "Enter") {
                if (chatID != session.getChatId()){
                    gotoRoom(chatID).then(function() {
                        updateMyChannels(session.getUsername());;
                    });
                    var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                    
                    if (screenHeight > 1900 || (screenWidth < 713 && screenHeight < 1900)){
                        document.querySelector(".chat-screen").style.display = "";
                        document.querySelector(".left-bar").style.display = "";
                    }
                }
                input.value = "";
            }
        });

        // Trigger: Activates the controller to exit the current session.
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();

            logoutSession();
        });

        // Trigger: Activates the controller to send a message using click.
        app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
            sendMessage();
        });

        // Trigger: Activates the controller to send a message using enter.
        inputMsg.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                // Executes the function when Enter is pressed
                sendMessage();
            }
        });

        var refreshButton = document.getElementById('refresh-rooms');

        refreshButton.addEventListener('click', function() {
            // Here you place the code you want to execute when the "refresh-rooms" button is clicked.
            // For example, you can call a function which updates the rooms
            updatePublicRooms(session.getUsername());
        });
    }

    // Server: Receives an update message for a room.
    function update(handleUpdate){
        socket.on("update", (update) => {
            handleUpdate(update, session.getType());
        });
    }

    // Server (Receive from server): Receives a message in a room.
    function chatting(handleChatMessage,username){
        socket.on("chat", (message) => {
            handleChatMessage(message, username, session.getType());
        });
    }
    
    // Controller (UI <-> Server): Controller to create a new room.
    function handleForm() {
        // Function to handle form logic
        if (isFormActive()) {
            // Get form values
            var formData = getFormData();
            chatHeader.setTitle(formData.newName);
            // Send the data to the server and handle the response
            handleServerCommunication(formData, session.getUsername(), session.getLastChatId(), function(roomId) {
                session.setChatId(roomId);
                chatHeader.setCode(session.getChatId());
                cleanMessages();
                updateMyChannels(session.getUsername());
                session.setLastChatId(session.getChatId());
            });
        }
    }

    // Controller (UI <-> Server): Controller to exit the current session.
    function logoutSession(){
        exit(session.getUsername());

        socket.on("logout",function(href){
            window.location.href = href; // Redirect to login page
        });

        document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    // Controller (IU <-> Server): Controller to go to a room.
    function gotoRoom(value) {
        // Function to manage room changeover
            return new Promise((resolve, reject) => {
                joinToRoom(value, session.getUsername(), session.getLastChatId())
    
                // Handle the server response to get the room information.
                socket.on('data-chat', function onDataChat(status, info) {
                    if (status) {
                        chatHeader.setTitle(info.name);
                        chatHeader.setCode(info.id);
                        cleanMessages();
    
                        session.setChatId(info.id);
                        session.setLastChatId(session.getChatId());
                        session.setType(0);
    
                        // Get messages from the server room
                        fetchRoomMessages(session.getChatId())
                            .then(data => {
                                // Update user interface with retrieved messages
                                updateMessages(data,session.getUsername(),session.getType());
                            })
                            .catch(error => {
                                console.error('Error getting messages: ', error);
                            })
                            .finally(() => {
                                // Solve the pledge after completing all tasks
                                console.log("Data successfully uploaded");
                                resolve();
                            });
                    }
                    socket.off('data-chat', onDataChat); // Unlink event listener after use
                });
            });
    }

    // Controller (UI <-> Server): Controller to go to a direct chat.
    function gotoDirectChat(value) {
        // Function to handle direct chat switching
            inputPers.value = "";
            if (value == session.getUsername()) {
                return;
            }
    
            joinToDirectChat(value, session.getUsername(), session.getLastChatId())
    
            // Handle server response to get the direct chat ID
            socket.on('userchat-id', function onDirectChat(status, ID_Relation) {
                if (status) {
                    chatHeader.setTitle(value);
                    chatHeader.setCode("");
                    cleanMessages();
    
                    session.setChatId(ID_Relation);
                    session.setLastChatId(session.getChatId());
                    session.setType(1);
    
                    // Get direct chat messages from the server
                    fetchDirectMessages(session.getChatId())
                        .then(data => {
                            // Update user interface with retrieved messages
                            updateMessages(data,session.getUsername(),session.getType());
                        })
                        .catch(error => {
                            console.error('Error getting messages: ', error);
                        });
                }
                socket.off('userchat-id', onDirectChat); // Unlink event listener after use
            });
    }

    // Controller (UI <-> Server): Controller to send messages to the server and display them in the chat.
    function sendMessage() {
    // Function to send a message
        const messageInput = app.querySelector(".chat-screen #message-input");
        let message = messageInput.value.trim(); // Removing blank spaces at the beginning and end of the message
        messageInput.value = ""; // Clear input field

        // Validate if the message is empty
        if (!message) {
            return; // Do nothing if the message is empty
        }

        // Get current time formatted
        const currentDate = new Date();
        const formattedHours = currentDate.getHours().toString().padStart(2, '0');
        const formattedMinutes = currentDate.getMinutes().toString().padStart(2, '0');
        const currentTime = `${formattedHours}:${formattedMinutes}`;

        renderMessage("my", session.getType(), {
            username: session.getUsername(),
            text: message,
            time: currentTime
        });
        sendMessageToServer(session.getUsername(), message, currentTime, session.getChatId(),session.getType());
    }

    // Controller (UI <-> Server): Controller to update the rooms in which a user is located.
    function updateMyChannels(username) {
        // Main function that calls the above functions to update the user interface with the user's rooms
        fetchUserRooms(username)
            .then(userRooms => {
                updateMyChannelsUI(userRooms);
            });
    }

    // Controller (UI <-> Server): Controller to update the direct messages that a user has.
    function updateMyDirectMsg(username) {
        // Main function that calls the above functions to update the user interface with the user's direct chats
        fetchUserDirectChats(username)
            .then(userDirectChats => {
                updateMyDirectMsgUI(userDirectChats);
            });
    }

    // Controller (UI <-> Server): Controller for updating public rooms in which a user is not present.
    function updatePublicRooms(username) {
        // Main function that calls the two functions to update the user interface with information from public rooms.
        fetchPublicRoomsData(username)
            .then(publicRoomsData => {
                updatePublicRoomsUI(publicRoomsData);
            });
    }

    // Call initialization function when the document is loaded
    document.addEventListener("DOMContentLoaded", init);
})(UIController, ServiceController);