const { Router } = require('express');
const ctrl = require('../controllers/moto.controller');
const { requiereRol } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', requiereRol('ADMIN'), ctrl.eliminar);

module.exports = router;
