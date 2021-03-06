const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async(req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array()});
    }

    //extraer email y password
    const { email, password } = req.body;
    
    try {
        //Revisar que el usuario sea unico
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'The user already exists' });
        }

        //Crea el nuevo usuario
        user = new User(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        //Guardar usuario
        await user.save();

        //Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 //1 hora
        }, (error, token) => {
            if (error) throw error;

            //Confirmacion
            return res.status(400).json({ token });

        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Ups, an error ocurred');
    }
};