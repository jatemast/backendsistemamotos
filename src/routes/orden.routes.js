const { Router } = require('express');
const ordenCtrl = require('../controllers/orden.controller');
const itemCtrl = require('../controllers/item.controller');
const { requiereRol } = require('../middlewares/auth.middleware');

const router = Router();

// Ordenes de trabajo
router.get('/', ordenCtrl.listar);
router.get('/:id', ordenCtrl.obtener);
router.post('/', ordenCtrl.crear);
router.put('/:id', ordenCtrl.actualizar);
router.patch('/:id/estado', ordenCtrl.cambiarEstado);
router.delete('/:id', requiereRol('ADMIN'), ordenCtrl.eliminar);

// Items anidados dentro de una orden
router.get('/:ordenId/items', itemCtrl.listar);
router.post('/:ordenId/items', itemCtrl.crear);
router.put('/:ordenId/items/:itemId', itemCtrl.actualizar);
router.delete('/:ordenId/items/:itemId', requiereRol('ADMIN'), itemCtrl.eliminar);

module.exports = router;
