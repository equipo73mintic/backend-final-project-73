const db = require ('../models');

module.exports = {

    // listar las categorias ( GET api/categoria/list )
    list: async(req, res, next) =>{

        try {
            const categorias = await db.Categoria.findAll();
            if (categorias){
                res.status(200).json(
                    categorias
                );
            }
        } catch (error) {
            res.status(500).send({
                message: "Has ocurred an "+ error
            })
            next(error);
        }
    },

    // agregar nueva categoria ( POST api/categoria/add )
    add: async(req, res, next) =>{
 
        await db.Categoria.create(req.body)
        .then(categoria =>{
            res.status(200).send({
                created: true,
                categoria: categoria
            });
        })
        .catch(error =>{
            res.status(400).send({
                created: false,
                categoria: null,
                reason: error + "."
            });
            next(error);
        });
    },

    // actualizar categoría ( PUT api/categoria/update )
    update : async(req, res, next) =>{
        try {
            const categoria = await db.Categoria.findOne({ where: { id: req.body.id } });
        
            if (categoria){
                await db.Categoria.update({ 
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion
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
                    message:  "Category not Found"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Has ocurred an "+ error
            })
            next(error);    
        }  
    }, 

    // Activar el estado
    activate: async(req, res, next) => {
        
        await db.Categoria.update({ estado: 1 }, { where: { id: req.body.id } })
        .then(updated => {
            if (updated[0] > 0){
                res.status(200).json({
                    updated: true,
                    estado: 'Activate'
                });
            } else {
                res.status(404).send({
                    updated: false,
                    reason: 'Category not Found'
                });
            }
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
            const updated = await db.Categoria.update({ estado: 0 }, { where: { id: req.body.id } });
            if (updated[0] > 0){
                res.status(200).json({
                    updated: true,
                    estado: 'Activate'
                });
            } else {
                res.status(404).send({
                    updated: false,
                    reason: 'Category not Found'
                });
            }
        } catch (err) {
            res.status(500).send({
                message: "Houston, we have an " + err
            });
            next(err);
        }
    },

    // Eliminar categoría
    remove: async(req, res, next) => {
        try {
            const reg = await db.Categoria.destroy({ where: { id: req.body.id }});
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: "Has ocurred an "+ error
            })
            next(error);
        }
    }
    
}