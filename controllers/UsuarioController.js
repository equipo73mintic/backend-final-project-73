const db = require('../models');
const bcrypt = require('bcryptjs');
const token = require('../services/token');

// Registrar un usuario ( POST api/usuario/add )
exports.add = async (req, res, next) =>{
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const user = await db.Usuario.create(req.body);
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).send({
            message: 'Error -> '+ error
        });
        next(error);
    }
}

// Iniciar sesión ( POST api/usuario/login )
exports.login = async(req, res, next) => {
    
    try {
        console.log(req.body.email)
        let user = await db.Usuario.findOne({ where: { email: req.body.email } });
        if (user) {
            let passwordIsValid = await bcrypt.compare(req.body.password, user.password);
            if (passwordIsValid) {
                console.log(user.rol);
                let tokenReturn = await token.encode(user);
                res.status(200).json({ 
                    auth: true,
                    // user, 
                    tokenReturn 
                });
            } else {
                res.status(401).send({
                    auth: false,
                    message: 'Invalid Password'
                });
            }
        } else {
            res.status(404).send({
                message: 'User not Found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'Houston, we have an '+ err
        });
        next(err);
    }
}


// Listar los usuarios ( GET api/usuario/list )
exports.list = async (req, res, next) =>{
  
    await db.Usuario.findAll()
    .then(users =>{
        res.status(200).json(
            users
        );
    })
    .catch(err =>{
        res.status(500).send({
            message: 'Has ocurred an '+ err
        });
        next(err);
    });
}

// Actualizar usuario (PUT api/usuario/update)
exports.update = async (req, res, next) =>{
    try {
        const exist = await db.Usuario.findOne({
            where: { id: req.body.id }
        });
        if (exist){
            // req.body.password = bcrypt.hashSync(req.body.password, 10);
            await db.Usuario.update({ 
                nombre: req.body.nombre,
                email: req.body.email,
                // password: req.body.password,
                rol: req.body.rol
            },{ 
                where: { id: req.body.id } 
            })
            .then(updated =>{
                res.status(200).json({
                    updated: true,
                    data: req.body
                });
            });    
        } else {
            res.status(404).send({
                message: 'User not Found'   
            });
        }
    } catch (err){
        res.status(500).send({
            message: "Opps! "+ err
        });
        next(err);
    }
}

exports.activate = async(req, res, next) =>{

    await db.Usuario.update({ estado: 1 }, { where: { id: req.body.id } })
    .then(updated => {
        if (updated[0] > 0){
            res.status(200).json({
                updated: true,
                estado: 'Activate'
            });
        } else {
            res.status(404).send({
                updated: false,
                reason: 'User not Found'
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Houston, we have an " + err
        });
        next(err);
    });
}

exports.deactivate = async(req, res, next) =>{
    try {
        const updated = await db.Usuario.update({ estado: 0 }, { where: { id: req.body.id } });
        if (updated[0] > 0){
            res.status(200).json({
                updated: true,
                estado: 'Deactivate'
            });
        } else {
            res.status(404).send({
                updated: false,
                reason: 'User not Found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Houston, we have an " + err
        });
        next(err);
    }
}

// obtener un usuario por parámetro
exports.query = async(req, res, next) =>{ 

    try {
        const user = await db.Usuario.findOne({ where: { id: req.query.id } });
        if (!user) {
            res.status(404).send({
                message: 'El registro no existe'
            });
        } else {
            res.status(200).json( user );
        }
    } catch (e) {
        res.status(500).send({
            message: 'Ocurrió un error'
        });
        next(e);
    }

}