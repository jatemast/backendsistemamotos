const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const requiereAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.post('/login', ctrl.login);
router.get('/yo', requiereAutenticacion, ctrl.yo);

module.exports = router;
