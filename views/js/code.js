function verificarTamañoPantalla() {
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

// Ejecutar la función cuando la página se carga
window.onload = verificarTamañoPantalla;

// Ejecutar la función cuando se cambie el tamaño de la pantalla
window.addEventListener('resize', verificarTamañoPantalla);

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

const UIController = (function() {
    var app = document.querySelector(".app");
    let mychannelsContainer = document.getElementById("channels");
    let mydirectmsgContainer = document.getElementById("direct-msg");
    let messageContainer = app.querySelector(".chat-screen .messages");
    let publicRoomContainer = app.querySelector(".right-bar .contents");
    var formBox = document.getElementById("new-room-form");
    var openFormBtn = document.getElementById("up-room-form");
    var closeFormBtn = document.getElementById("cancel-form");
    
    // UI: Abre o cierra el formulario para crear una nueva sala.
    function openForm(){
        openFormBtn.addEventListener("click", function() {
            if (formBox.style.display === "block"){
                formBox.style.display = "none";
            } else {
                formBox.style.display = "block";
            }
        });
    }

    // UI: Cierra la pestaña para crear una nueva sala.
    function closeForm(){
        closeFormBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del hipervínculo
            formBox.style.display = "none";
        });
    }

    // UI: Recupera el username del usuario.
    function getAppUsername() {
        var username = app.getAttribute("data-username");
        if (username.length == 0) {
            return;
        }
        return username;
    }

    // UI: Evalúa si el formulario para crear una nueva sala está activo o no.
    function isFormActive() {
        var form = document.getElementById("new-room-form");
        return form.style.display === "block"; // Suponiendo que el formulario se activa con display block
    }

    // UI: Obtiene los valores del formulario para crear una nueva sala.
    function getFormData() {
        // Obtener referencias a los elementos del formulario
        var newNameInput = document.getElementById("new-room-name");
        var newDescriptionInput = document.getElementById("new-room-description");
        var opcionInputs = document.getElementsByName("opcion");

        // Obtener el valor del nombre y descripción
        var newName = newNameInput.value;
        var newDescription = newDescriptionInput.value;

        // Obtener la opción seleccionada
        var selectedOption;
        for (var i = 0; i < opcionInputs.length; i++) {
            if (opcionInputs[i].checked) {
                selectedOption = opcionInputs[i].value;
                break;
            }
        }

        // Devolver un objeto con los valores del formulario
        return {
            newName: newName,
            newDescription: newDescription,
            selectedOption: selectedOption
        };
    }

    // UI: Limpia los mensajes actuales.
    function cleanMessages(){
        messageContainer.innerHTML = " ";
    }

    // UI: Función que modifica el ícono del usuario
    function cambiarContenidoCirculo(texto) {
        // Tomar la primera y última letra del string
        var primeraLetra = texto.charAt(0).toUpperCase();
        var ultimaLetra = texto.charAt(texto.length - 1).toUpperCase();

        // Concatenar las letras en mayúsculas
        var nuevoContenido = primeraLetra + ultimaLetra;

        // Seleccionar el elemento con la clase "circulo"
        var circulo = document.querySelector(".circulo");

        // Cambiar el contenido del elemento
        circulo.textContent = nuevoContenido;
    }

    // UI: Actualiza los mensajes actuales para mostrarlos en pantalla.
    function updateMessages(messages,username,type) {
        try {
            messageContainer.innerHTML = ""; // Limpiar el contenedor de mensajes
            messages.forEach(message => {
                // Determinar si el mensaje es del usuario actual o de otro usuario y renderizarlo en consecuencia
                if (message.sender == username) {
                    renderMessage("my", type, {
                        username: message.sender,
                        text: message.message,
                        time: message.hora.substring(0, 5)
                    });
                } else {
                    renderMessage("other", type, {
                        username: message.sender,
                        text: message.message,
                        time: message.hora.substring(0, 5)
                    });
                }
            });
        } catch (error) {
            console.error('Error al actualizar la interfaz de usuario:', error);
            // Podrías tomar medidas adicionales aquí si la actualización de la interfaz de usuario falla
        }
    }

    // IU: Despliega un mensaje recibido por el servidor.
    function handleChatMessage(message,username,type) {
        const messageType = message.username === username ? "my" : "other";
        renderMessage(messageType, type, message);
    }

    // IU: Despliega un mensaje al unirse un usuario a la sala.
    function handleUpdate(update,type) {
        // Función para manejar actualizaciones generales
        renderMessage("update", type, update);
    }

    // IU: Actualiza la información de la barra izquiera con las salas del usuario.
    function updateMyChannelsUI(userRooms) {
    // Función para 
        try {
            mychannelsContainer.innerHTML = ""; // Limpiar el contenido del contenedor

            // Renderizar cada sala del usuario en la interfaz de usuario
            userRooms.forEach(room => {
                renderMyChats("Channel", {
                    id: room.id,
                    name: room.name
                });
            });
        } catch (error) {
            console.error('Error al actualizar la interfaz de usuario:', error);
            // Podrías tomar medidas adicionales aquí si la actualización de la interfaz de usuario falla
        }
    }

    // IU: Actualiza la información de la barra izquiera con los chats directos del usuario.
    function updateMyDirectMsgUI(userDirectChats) {
    // Función para actualizar la interfaz de usuario con la información de los chats directos del usuario
        try {
            mydirectmsgContainer.innerHTML = ""; // Limpiar el contenido del contenedor

            // Renderizar cada chat directo en la interfaz de usuario
            userDirectChats.forEach(chat => {
                renderMyChats("Direct", {
                    id: chat.id,
                    name: chat.other_user_id
                });
            });
        } catch (error) {
            console.error('Error al actualizar la interfaz de usuario:', error);
            // Podrías tomar medidas adicionales aquí si la actualización de la interfaz de usuario falla
        }
    }

    // IU: Actualiza la información de la barra derecha con las salas públicas que no tiene el usuario.
    function updatePublicRoomsUI(publicRoomsData) {
        try {
            publicRoomContainer.innerHTML = ""; // Limpiar el contenido del contenedor
    
            // Renderizar cada sala pública en la interfaz de usuario
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
            console.error('Error al actualizar la interfaz de usuario:', error);
            // Podrías tomar medidas adicionales aquí si la actualización de la interfaz de usuario falla
        }
    }

    // IU: Inserta un acceso directo a un chat (sala o directo) en la barra izquierda.
    function renderMyChats(type, room) {
        // Determinar el contenedor correspondiente según el tipo
        let container = type === "Channel" ? mychannelsContainer : mydirectmsgContainer;
    
        // Crear el elemento div correspondiente
        let chatElement = document.createElement("div");
    
        // Construir el HTML del elemento según el tipo
        let html = type === "Channel"
            ? `<a href="#" class="channel" my-room-id="${room.id}">#${room.name}</a>`
            : `<a href="#" class="direct" my-chat-id="${room.name}">@${room.name}</a>`;
    
        // Establecer el contenido HTML del elemento
        chatElement.innerHTML = html;
    
        // Agregar el elemento al contenedor correspondiente
        container.appendChild(chatElement);
    }        

    // IU: Inserta una sala pública en la barra derecha.
    function renderPublicRoom(room) {
        // Crear el HTML del elemento de la sala pública
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
    
        // Insertar el HTML del elemento de la sala pública en el contenedor de salas públicas
        publicRoomContainer.insertAdjacentHTML('beforeend', roomHTML);
    }    

    // IU: Inserta un mensaje en el contenedor de mensajes.
    function renderMessage(type, private, message) {
        // Crear un nuevo elemento div para representar el mensaje
        let messageElement = document.createElement("div");
    
        // Determinar la clase del mensaje según el tipo (propio o de otro usuario)
        let messageClass = type === "my" ? "my-message" : type === "other" ? "other-message" : "update";

        // Agregar las clases al elemento del mensaje
        messageElement.classList.add(messageClass);
    
        // Construir el contenido HTML del mensaje
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
    
        // Si el mensaje es de tipo "update" y no es privado, se usa el contenido directo en lugar de un formato específico
        if (type === "update" && !private) {
            innerHTML = message;
        } else {
            messageElement.classList.add("message");
        }
    
        // Agregar el contenido HTML al elemento del mensaje
        messageElement.innerHTML = innerHTML;
    
        // Agregar el elemento del mensaje al contenedor de mensajes
        messageContainer.appendChild(messageElement);

        // Desplazar el contenedor de mensajes hacia abajo para mostrar el mensaje recién agregado
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    return {
        openForm: openForm,
        closeForm: closeForm,
        getAppUsername: getAppUsername,
        isFormActive: isFormActive,
        getFormData: getFormData,
        cleanMessages: cleanMessages,
        cambiarContenidoCirculo: cambiarContenidoCirculo,
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
    // Server: Se conecta del usuario al servidor.
    const socket = io({
        extraHeaders: {
            "username": username
        }
    });
    
    // Server (Envía al servidor): Solicita al servidor la creación de una nueva sala.
    function createRoom(roomName,desc,option,username,lastchatid){
        socket.emit('create room', {roomName, desc, option}, username, lastchatid);
    }

    // Server (Envía al servidor): Crea y obtiene el id de una nueva sala.
    function handleServerCommunication(formData, username, lastchatid, callback) {
        // Función para manejar la lógica de comunicación con el servidor
        createRoom(formData.newName, formData.newDescription, formData.selectedOption, username, lastchatid)

        // Manejar la respuesta del servidor para obtener el ID de la sala creada
        socket.on('room-id', (roomId) => {
            callback(roomId);
        });
    }

    // Server: Le informa al servidor de un inicio de sesión
    function login(username){
        socket.emit("newuser",username);
    }
    
    // Server (Envía al servidor): Solicita al servidor salir de la sesión
    function exit(username) {
        // Función para interactuar con el servidor
        socket.emit("exituser",username);
    }

    // Server (Recibe del servidor): Actualiza la página.
    function refreshPage(){
        socket.on("refresh",function(){
            window.location.reload(true); // Recarga la página
        });
    }

    // Server (Recibe del servidor): Obtener los mensajes de una sala.
    function fetchRoomMessages(roomId) {
        return fetch(`/messages/room/${roomId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los mensajes');
                }
                return response.json();
            });
    }

    // Server (Envía al servidor): Solicita al servidor unirse a una sala.
    function joinToRoom(message, username, lastchatid) {
        // Función para interactuar con el servidor
        socket.emit("join room", message, username, lastchatid);
    }

    // Server (Recibe del servidor): Obtener los mensajes de un chat directo.
    function fetchDirectMessages(chatId) {
        return fetch(`/messages/user/${chatId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los mensajes');
                }
                return response.json();
            });
    }

    // Server (Envía al servidor): Solicita al servidor unirse a un chat directo.
    function joinToDirectChat(message, username, lastchatid) {
        // Función para interactuar con el servidor
        socket.emit("direct message", message, username, lastchatid);
    }

    // Server (Recibe del servidor): Recibe un mensaje directo.
    function newDirectMsg(updateMyDirectMsg){
        socket.on('new-direct-message', updateMyDirectMsg);
    }

    // Server (Envía al servidor): Envía un mensaje al servidor.
    function sendMessageToServer(username, message, currentTime, chatId, type) {
    // Función para interactuar con el servidor
        socket.emit("chat", {
            username: username,
            text: message,
            time: currentTime
        }, chatId, type);
    }

    // Server (Envía y recibe del servidor): Solicita al servidor todas las salas en las que se encuentra un usuario.
    function fetchUserRooms(username) {
    // Función para obtener la información de las salas del usuario desde el servidor
        return fetch(`/load/user-rooms/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las salas del usuario: ' + response.statusText);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error en la solicitud fetch:', error);
                return []; // Retornar un array vacío en caso de error
            });
    }

    // Server (Envía y recibe del servidor): Solicita al servidor todos los chats directos que tiene un usuario.
    function fetchUserDirectChats(username) {
    // Función para obtener la información de los chats directos del usuario desde el servidor
        return fetch(`/load/user-chats/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los chats directos del usuario: ' + response.statusText);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error en la solicitud fetch:', error);
                return []; // Retornar un array vacío en caso de error
            });
    }

    // Server (Envía y recibe del servidor): Solicita al servidor todas las salas públicas en las que no se encuentra un usuario.
    function fetchPublicRoomsData(username) {
        return fetch(`/load/public-rooms/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las salas públicas: ' + response.statusText);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error en la solicitud fetch:', error);
                return []; // Retornar un array vacío en caso de error
            });
    }

    // Retorno de todas las funciones
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
        cambiarContenidoCirculo,
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

    // Init App: Establece la cabezera del chat actual.
    const chatHeader = {
        Title: "",
        Code: "",

        // Funciones para establecer valores
        setTitle: function(value) {
            var ttl = value.charAt(0).toUpperCase() + value.slice(1);

            document.getElementById("chat-title").innerHTML = "#"+ttl;
            this.Title = ttl;
        },
        setCode: function(value) {
            document.getElementById("chat-code").innerHTML = value;
            this.Code = value;
        },

        // Funciones para obtener valores
        getTitle: function() {
            return this.Title;
        },
        getCode: function() {
            return this.Code;
        }
    }

    // Init App: Establece los valores actuales de la sesión.
    const session = {
        username: "",
        lastChatId: "",
        chatId: "",
        type: "",
        
        // Funciones para establecer valores
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
        
        // Funciones para obtener valores
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
    
    // Función principal que inicia la aplicación
    function init() {
        // Configurar eventos de la interfaz de usuario
        setupUIEvents();

        // Configurar eventos del servidor
        setupServiceEvents();   
        
        // Configurar eventos de la aplicación
        setupAppEvents();

        // Configurar eventos de los triggers
        setupTriggerEvents();
    }

    function setupAppEvents(){
        // Init App: Establecen los valores iniciales de cualquier sesión.
        session.setUsername(getAppUsername());
        session.setLastChatId("");
        session.setChatId("1SnuCA==");
        session.setType(0);

        // Init App: Establece los valores del usuario al iniciar sesión.
        gotoRoom(session.getChatId()).then(function() {
            updatePublicRooms(session.getUsername());
            updateMyChannels(session.getUsername());
            updateMyDirectMsg(session.getUsername());
        });

        // Init UI: Establece el ícono del usuario
        cambiarContenidoCirculo(session.getUsername());
    }

    function setupUIEvents(){
        // UI Init: Inicializa el botón para el formulario que crea una nueva sala.
        openForm();
        // UI Init: Inicializa el botón salir del formulario que crea una nueva sala.
        closeForm();
        // UI Init: Inicializa los botones flecha para abrir o cerrar pestañas.
    }

    function setupServiceEvents(){
        login(getAppUsername());
        refreshPage();
        newDirectMsg(updateMyDirectMsg);
        update(handleUpdate);
        chatting(handleChatMessage,session.getUsername());
    }

    function setupTriggerEvents(){
        // Trigger: Activa el controlador para unirse a una sala pública a la que no se ha unido.
        roomContainer.addEventListener('click', function(event) {
            // Verificar si el elemento clickeado es un botón
            if (event.target.classList.contains('join-to-room')) {
                // Obtener el título de la caja asociada al botón clickeado
                var roomId = event.target.parentNode.querySelector('.join-to-room').getAttribute("public-room-id");
                // Imprimir el título en la consola
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

        // Trigger: Activa el controlador para unirse a una sala a la que ya se ha unido el usuario.
        channelsContainer.addEventListener('click', function(event) {
            event.preventDefault();
            // Verificar si el elemento clickeado es un botón
            if (event.target.classList.contains('channel')) {
                // Obtener el título de la caja asociada al botón clickeado
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

        // Trigger: Activa el controlador para unirse a un chat directo al que ya se ha unido el usuario.
        directmsgContainer.addEventListener('click', function(event) {
            event.preventDefault();
            // Verificar si el elemento clickeado es un botón
            if (event.target.classList.contains('direct')) {
                // Obtener el título de la caja asociada al botón clickeado
                var roomId = event.target.parentNode.querySelector('.direct').getAttribute("my-chat-id");
                // Imprimir el título en la consola
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

        // Trigger: Activa el controlador para crear una nueva sala.
        createNewRoom.addEventListener("submit", function(event) {
            // Agregar un evento para manejar el formulario cuando se envíe
            event.preventDefault(); // Evitar que el formulario se envíe
            handleForm(); // Llamar a la función de manejo del formulario
            // Ocultar el formulario después de procesarlo
            createNewRoom.style.display = "none";
            var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if (screenHeight > 1900 || (screenWidth < 713 && screenHeight < 1900)){
                document.querySelector(".chat-screen").style.display = "";
                document.querySelector(".right-bar").style.display = "";
            }
        });

        // Trigger: Activa el controlador para irse a un chat directo
        inputPers.addEventListener("keyup", function(event) {
            // 'Enter' es la tecla 'Intro' en español
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
        
        // Trigger: Activa el controlador para irse a una sala
        input.addEventListener("keyup", function(event) {
            // 'Enter' es la tecla 'Intro' en español
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

        // Trigger: Activa el controlador para salir de la sesión actual.
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();

            logoutSession();
        });

        // Trigger: Activa el controlador para enviar un mensaje usando click.
        app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
            sendMessage();
        });

        // Trigger: Activa el controlador para enviar un mensaje usando enter.
        inputMsg.addEventListener("keyup", function(event) {
            // 'Enter' es la tecla 'Intro' en español
            if (event.key === "Enter") {
                // Ejecuta la función cuando se presiona Enter
                sendMessage();
            }
        });

        var refreshButton = document.getElementById('refresh-rooms');

        refreshButton.addEventListener('click', function() {
            // Aquí colocas el código que deseas ejecutar cuando se hace clic en el botón "refresh-rooms"
            // Por ejemplo, puedes llamar a una función que actualiza las habitaciones
            updatePublicRooms(session.getUsername());
        });
    }

    // Server (Recibe del servidor): Recibe un mensaje de actualización para una sala.
    function update(handleUpdate){
        socket.on("update", (update) => {
            handleUpdate(update, session.getType());
        });
    }

    // Server (Recibe del servidor): Recibe un mensaje en una sala.
    function chatting(handleChatMessage,username){
        socket.on("chat", (message) => {
            handleChatMessage(message, username, session.getType());
        });
    }
    
    // Controller (IU <-> Server): Controlador para crear una nueva sala.
    function handleForm() {
        // Función para manejar la lógica del formulario
        if (isFormActive()) {
            // Obtener los valores del formulario
            var formData = getFormData();
            chatHeader.setTitle(formData.newName);
            // Enviar los datos al servidor y manejar la respuesta
            handleServerCommunication(formData, session.getUsername(), session.getLastChatId(), function(roomId) {
                session.setChatId(roomId);
                chatHeader.setCode(session.getChatId());
                cleanMessages();
                updateMyChannels(session.getUsername());
                session.setLastChatId(session.getChatId());
            });
        }
    }

    // Controller (IU <-> Server): Controlador para salir de la sesión actual.
    function logoutSession(){
        exit(session.getUsername());

        socket.on("logout",function(href){
            window.location.href = href; // Redirige a la página de inicio de sesión
        });

        document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    // Controller (IU <-> Server): Controlador para irse a una sala.
    function gotoRoom(valor) {
        // Función para manejar el cambio de sala
            return new Promise((resolve, reject) => {
                joinToRoom(valor, session.getUsername(), session.getLastChatId())
    
                // Manejar la respuesta del servidor para obtener la información de la sala
                socket.on('data-chat', function onDataChat(status, info) {
                    if (status) {
                        chatHeader.setTitle(info.name);
                        chatHeader.setCode(info.id);
                        cleanMessages();
    
                        session.setChatId(info.id);
                        session.setLastChatId(session.getChatId());
                        session.setType(0);
    
                        // Obtener los mensajes de la sala del servidor
                        fetchRoomMessages(session.getChatId())
                            .then(data => {
                                // Actualizar la interfaz de usuario con los mensajes recuperados
                                updateMessages(data,session.getUsername(),session.getType());
                            })
                            .catch(error => {
                                console.error('Error al obtener los mensajes:', error);
                            })
                            .finally(() => {
                                // Resolve la promesa después de completar todas las tareas
                                console.log("Datos cargados exitosamente");
                                resolve();
                            });
                    }
                    socket.off('data-chat', onDataChat); // Desvincular el event listener después de su uso
                });
            });
    }

    // Controller (IU <-> Server): Controlador para irse a un chat directo. 
    function gotoDirectChat(valor) {
        // Función para manejar el cambio de chat directo
            inputPers.value = "";
            if (valor == session.getUsername()) {
                return;
            }
    
            joinToDirectChat(valor, session.getUsername(), session.getLastChatId())
    
            // Manejar la respuesta del servidor para obtener el ID del chat directo
            socket.on('userchat-id', function onDirectChat(status, relacionID) {
                if (status) {
                    chatHeader.setTitle(valor);
                    chatHeader.setCode("");
                    cleanMessages();
    
                    session.setChatId(relacionID);
                    session.setLastChatId(session.getChatId());
                    session.setType(1);
    
                    // Obtener los mensajes del chat directo del servidor
                    fetchDirectMessages(session.getChatId())
                        .then(data => {
                            // Actualizar la interfaz de usuario con los mensajes recuperados
                            updateMessages(data,session.getUsername(),session.getType());
                        })
                        .catch(error => {
                            console.error('Error al obtener los mensajes:', error);
                        });
                }
                socket.off('userchat-id', onDirectChat); // Desvincular el event listener después de su uso
            });
    }

    // Controller (IU <-> Server): Controlador para enviar mensajes al servidor y desplegarlos en el chat.
    function sendMessage() {
    // Función para enviar un mensaje
        const messageInput = app.querySelector(".chat-screen #message-input");
        let message = messageInput.value.trim(); // Eliminar espacios en blanco al inicio y al final del mensaje
        messageInput.value = ""; // Limpiar el campo de entrada

        // Validar si el mensaje está vacío
        if (!message) {
            return; // No hacer nada si el mensaje está vacío
        }

        // Obtener la hora actual formateada
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

    // Controller (IU <-> Server): Controlador para actualizar las salas en las que se encuentra un usuario.
    function updateMyChannels(username) {
        // Función principal que llama a las funciones anteriores para actualizar la interfaz de usuario con las salas del usuario
        fetchUserRooms(username)
            .then(userRooms => {
                updateMyChannelsUI(userRooms);
            });
    }

    // Controller (IU <-> Server): Controlador para actualizar los mensajes directos que tiene un usuario.
    function updateMyDirectMsg(username) {
        // Función principal que llama a las funciones anteriores para actualizar la interfaz de usuario con los chats directos del usuario
        fetchUserDirectChats(username)
            .then(userDirectChats => {
                updateMyDirectMsgUI(userDirectChats);
            });
    }

    // Controller (IU <-> Server): Controlador para actualizar las salas públicas en las que no se encuentra un usuario.
    function updatePublicRooms(username) {
        // Función principal que llama a las dos funciones para actualizar la interfaz de usuario con la información de las salas públicas
        fetchPublicRoomsData(username)
            .then(publicRoomsData => {
                updatePublicRoomsUI(publicRoomsData);
            });
    }

    // Llamar a la función de inicialización cuando se cargue el documento
    document.addEventListener("DOMContentLoaded", init);
})(UIController, ServiceController);