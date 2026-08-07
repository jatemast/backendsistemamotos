const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const resultado = await authService.login(email, password);
  res.json({ ok: true, data: resultado });
});

const yo = asyncHandler(async (req, res) => {
  const usuario = await authService.perfil(req.usuario.id);
  res.json({ ok: true, data: usuario });
});

module.exports = { login, yo };
