const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ordenService = require('../services/orden.service');

const listar = asyncHandler(async (req, res) => {
  const resultado = await ordenService.listar(req.query);
  res.json({ ok: true, ...resultado });
});

const obtener = asyncHandler(async (req, res) => {
  const orden = await ordenService.obtenerPorId(req.params.id);
  res.json({ ok: true, data: orden });
});

const crear = asyncHandler(async (req, res) => {
  const orden = await ordenService.crear(req.body);
  res.status(201).json({ ok: true, data: orden });
});

const actualizar = asyncHandler(async (req, res) => {
  const orden = await ordenService.actualizar(req.params.id, req.body);
  res.json({ ok: true, data: orden });
});

const cambiarEstado = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  if (!estado) throw ApiError.badRequest('Debe indicar el nuevo estado de la orden.');
  const orden = await ordenService.cambiarEstado(req.params.id, estado);
  res.json({ ok: true, data: orden });
});

const eliminar = asyncHandler(async (req, res) => {
  await ordenService.eliminar(req.params.id);
  res.status(204).send();
});

module.exports = { listar, obtener, crear, actualizar, cambiarEstado, eliminar };
