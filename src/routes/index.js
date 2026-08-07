const { Router } = require('express');
const authRoutes = require('./auth.routes');
const clienteRoutes = require('./cliente.routes');
const motoRoutes = require('./moto.routes');
const ordenRoutes = require('./orden.routes');
const requiereAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true, message: 'API Taller de Motos Pavas activa' }));

// Publica (login)
router.use('/auth', authRoutes);

// A partir de aqui, todas las rutas requieren sesion iniciada
router.use('/clientes', requiereAutenticacion, clienteRoutes);
router.use('/motos', requiereAutenticacion, motoRoutes);
router.use('/ordenes', requiereAutenticacion, ordenRoutes);

module.exports = router;
