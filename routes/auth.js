//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

//Crear un usuario
// api/auth
router.post('/',
    [
        check('email', 'Incorrect email and/or password').isEmail(),
        check('password', 'The password has to be min 6 characters').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
);

module.exports = router;