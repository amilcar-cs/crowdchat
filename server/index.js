// Importar dependencias para el servidor
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const { engine } = require('express-handlebars');
const session = require('express-session');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Usar Variables de Entorno
const dotenv = require('dotenv');
const path = require('path');

// Especifica la ruta completa al archivo .env
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Importar enrutadores
const loginRoutes = require('./routes/loginRouter');
const messageRouter = require('./routes/messageRouter');
const loadRouter = require('./routes/loadRouter');

// Importar funcionalidad de socket.io
const socketEvents = require('./sockets/socketEvents');;

// Configuración de Express
app.set('view engine', 'hbs');
app.engine('.hbs',engine({extname: '.hbs',}));

// Middleware para procesar datos de formulario y JSON
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Middleware para utilizar cookies seguras
app.use(cookieParser());

// Middleware para evitar ataques XSS
app.use(helmet());

// Configuración de las sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Redireccionar las solicitudes HTTP a un enrutador
app.use('/auth', loginRoutes); // los que tengan /auth en su url son de tipo login/register/logout
app.use('/messages', messageRouter); // los que tienen /messages en su url son para cargar los mensajes
app.use('/load',loadRouter); // los que tienen /load en su url son para cargar los datos de los chats y rooms

// Cargar directorio
const dir = path.resolve(__dirname, '../views');
app.use(express.static(dir));

// Establecer conexión permanente
app.get('/',(req,res) => {
    if(req.session.loggedin == true){
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.render('home', {username: req.session.username} );
    } else {
      res.redirect('/auth/login');
    }
});

// Configuración de Socket.IO
io.use(require('./middleware/socketAuth'));

// Llama a la función exportada de socketEvents y pásale los parámetros necesarios
socketEvents(io);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

