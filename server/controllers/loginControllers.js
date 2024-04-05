const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Usar Variables de Entorno
const dotenv = require('dotenv');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const jwtSecretKey = process.env.JWT_SECRET;


async function login(req, res) {
    if (req.session.loggedin !== true) {
        res.render('login/login', { csrfToken: req.csrfToken() });
    } else {
        res.redirect('/');
    }
}

async function auth(req, res) {
    const usernameEntered = req.body.username;
    const passwordEntered = req.body.password;

    try {
        const user = await User.find(usernameEntered);
        if (!user) {
            return res.status(401).render('login/login', { csrfToken: req.csrfToken(), error: 'Error: Usuario no encontrado' });
        }

        bcrypt.compare(passwordEntered, user.password, (err, isMatch) => {
            if (!isMatch) {
                return res.status(401).render('login/login', { csrfToken: req.csrfToken(), error: 'Error: contraseña incorrecta' });
            } else {
                const token = jwt.sign({ userID: user.username }, jwtSecretKey, { expiresIn: '1h' });
                res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 });
                req.session.loggedin = true;
                req.session.username = user.username;
                req.session.password = user.password;
                res.redirect('/');
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

async function register(req, res) {
    if (req.session.loggedin !== true) {
        res.render('login/register', { csrfToken: req.csrfToken() });
    } else {
        res.redirect('/');
    }
}

async function storeUser(req, res) {
    const usernameEntered = req.body.username;
    const passwordEntered = req.body.password;
    const cpasswordEntered = req.body.confirmPassword;

    if (passwordEntered != cpasswordEntered){
        return res.status(401).render('login/register', { csrfToken: req.csrfToken(), error: 'Error: las contraseñas no coinciden' });
    }
    try {
        const existingUser = await User.find(usernameEntered);
        if (existingUser) {
            return res.status(401).render('login/register', { csrfToken: req.csrfToken(), error: 'Error: el usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(passwordEntered, 12);
        const userId = await User.create(usernameEntered, hashedPassword);
        res.redirect('/');
        console.log('Usuario creado exitosamente. ID del usuario:', userId);
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

function logout(req, res) {
    if (req.session.loggedin === true) {
        req.session.destroy();
        res.clearCookie('jwt');
    }
    res.redirect('/auth/login');
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
};
