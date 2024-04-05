const express = require('express');
const router = express.Router();
const csrf = require('@dr.pogodin/csurf');
const csrfProtection = csrf({ cookie: true });

// Importar controladores de rutas
const LoginController = require('../controllers/loginControllers');


router.get('/login',csrfProtection,LoginController.login);
router.post('/login',csrfProtection,LoginController.auth);
router.get('/register',csrfProtection,LoginController.register);
router.post('/register',csrfProtection,LoginController.storeUser);
router.get('/logout',csrfProtection,LoginController.logout);

module.exports = router;