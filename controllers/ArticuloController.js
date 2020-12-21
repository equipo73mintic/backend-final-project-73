const db = require('../models');

module.exports = {

    // listar los articulos ( GET api/articulo/list )
    list: async(req, res, next) =>{

        await db.Articulo.findAll({
            include: [{
                model: db.Categoria,
                as: 'categoria',
                attributes: ['id','nombre', 'descripcion']
            }]
        })
        .then(articulos =>{
            res.status(200).json( articulos )
        })
        .catch(err =>{
            res.status(500).send(
                "Error => "+ err
            )
            next(err);
        });
    },

    // agregar nuevo articulo ( POST api/articulo/add )
    add: async(req, res, next) =>{
 
        await db.Articulo.create(req.body)
        .then(articulo =>{
            res.status(200).send({
                created: true,
                articulo
            });
        })
        .catch(err =>{
            res.status(400).send({
                created: false,
                articulo: null,
                reason: err + "."
            });
            next(err);
        });
    },

    // actualizar categoria ( PUT api/articulo/update )
    update : async(req, res, next) =>{
        try {
            const articulo = await db.Articulo.findOne({ where: { id: req.body.id } });
        
            if (articulo){
                await db.Articulo.update({ 
                    codigo: req.body.codigo,
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    urlImage: req.body.urlImage,
                    categoriaId: req.body.categoriaId
                },{
                    where: { id: req.body.id }
                })
                .then(updated =>{ 
                        res.status(200).send({ // Si se actualiza correctamente
                            updated: true,
                            data: req.body
                        });                
                });
            } else{
                res.status(404).send({ // Si no se encuentra el id
                    message:  "Article not Found"
                });
            }
        } catch (error) {
            res.status(500).send({ // Cualquier otro error
                error: error +""
            });    
        }  
    }, 

    // Activar el estado
    activate: async(req, res, next) => {
        
        await db.Articulo.update({ estado: 1 }, { where: { id: req.body.id } })
        .then(updated => {
            res.status(200).json({
                updated: updated,
                estado: 1
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Houston, we have an " + err
            });
            next(err);
        });
    },

    // Desactivar el estado
    deactivate: async(req, res, next) => {
        try {
            const reg = await db.Articulo.update({ estado: 0 }, { where: { id: req.body.id } });
            res.status(200).json(reg);
        } catch (err) {
            res.status(500).send({
                message: "Houston, we have an " + err
            });
            next(err);
        }
    },

    // Eliminar articulo
    remove: async(req, res, next) => {
        try {
            const reg = await db.Articulo.destroy({ where: { id: req.body.id }});
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    }
    
}