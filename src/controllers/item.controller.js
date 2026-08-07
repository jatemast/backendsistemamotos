const asyncHandler = require('../utils/asyncHandler');
const itemService = require('../services/item.service');

const listar = asyncHandler(async (req, res) => {
  const items = await itemService.listarPorOrden(req.params.ordenId);
  res.json({ ok: true, data: items });
});

const crear = asyncHandler(async (req, res) => {
  const item = await itemService.crear(req.params.ordenId, req.body);
  res.status(201).json({ ok: true, data: item });
});

const actualizar = asyncHandler(async (req, res) => {
  const item = await itemService.actualizar(req.params.ordenId, req.params.itemId, req.body);
  res.json({ ok: true, data: item });
});

const eliminar = asyncHandler(async (req, res) => {
  await itemService.eliminar(req.params.ordenId, req.params.itemId);
  res.status(204).send();
});

module.exports = { listar, crear, actualizar, eliminar };
