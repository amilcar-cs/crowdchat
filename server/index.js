// Import dependencies for the server
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


// Using Environment Variables
const dotenv = require('dotenv');
const path = require('path');

// Specifies the full path to the .env file
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Import routers
const loginRoutes = require('./routes/loginRouter');
const messageRouter = require('./routes/messageRouter');
const loadRouter = require('./routes/loadRouter');

// Import functionality from socket.io
const socketEvents = require('./sockets/socketEvents');;

// Express Configuration
app.set('view engine', 'hbs');
app.engine('.hbs',engine({extname: '.hbs',}));

// Middleware for form data and JSON processing
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Middleware to use secure cookies
app.use(cookieParser());

// Middleware to prevent XSS attacks
app.use(helmet());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Redirecting HTTP requests to a router
app.use('/auth', loginRoutes); // those with /auth in their url are of type login/register/logout
app.use('/messages', messageRouter); // those with /messages in their url are for uploading messages
app.use('/load',loadRouter); // those with /load in their url are for loading data from chats and rooms

// Load directory
const dir = path.resolve(__dirname, '../views');
app.use(express.static(dir));

// Establish permanent connection
app.get('/',(req,res) => {
    if(req.session.loggedin == true){
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.render('home', {username: req.session.username} );
    } else {
      res.render('landing')
    }
});

// Socket.IO configuration
io.use(require('./middleware/socketAuth'));

// Call the exported socketEvents function and pass the necessary parameters to it
socketEvents(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

