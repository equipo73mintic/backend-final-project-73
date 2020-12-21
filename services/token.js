var jwt = require('jsonwebtoken');
const db = require('../models');

async function checkToken(token) {
    let __id = null;
    try {
        const { id } = await token.decode(token);
        __id = id;
    } catch (e) {
        return false;
    }
    console.log(__id);
    const user = await db.Usuario.findOne({ where: { id: __id, estado: 1 } });
    if (user) {
        const token = encode(user);
        return {
            token,
            rol: user.rol
        }
    } else {
        return false;
    }
}

module.exports = {

    //generar el token
    encode: async(user) => {
        const token = await jwt.sign({
            id: user.id, 
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        }, 
        'secretKey', 
        { expiresIn: '1d' });
       
        return token;
    },
    //permite decodificar el token
    decode: async(token) => {
        try {
            const { id } = await jwt.verify(token, 'secretKey');
            const user = await db.Usuario.findOne({ where: { id: id } });
            if (user) {
                return user;
            } else {
                return false;
            }
        } catch (e) {
            const newToken = await checkToken(token);
            return newToken;
        }

    }
}