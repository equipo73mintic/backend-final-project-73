const routerx = require('express-promise-router');
const articuloController = require('../../controllers/ArticuloController');
const auth = require('../../middlewares/auth');

const router = routerx();

router.get('/list', articuloController.list);
router.post('/add',  articuloController.add);
router.put('/update',  articuloController.update);
router.put('/activate',  articuloController.activate);
router.put('/deactivate',  articuloController.deactivate);
router.delete('/remove',  articuloController.remove);

module.exports = router;