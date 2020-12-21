const routerx = require('express-promise-router');
const apiCategoriaRouter = require('./api/categoria.js');
const apiArticuloRouter = require('./api/articulo.js');
const apiUsuarioRouter = require('./api/usuario.js');

const router = routerx();

router.use('/usuario', apiUsuarioRouter);
router.use('/categoria', apiCategoriaRouter);
router.use('/articulo', apiArticuloRouter);

module.exports = router;