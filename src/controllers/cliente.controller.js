const asyncHandler = require('../utils/asyncHandler');
const clienteService = require('../services/cliente.service');

const listar = asyncHandler(async (req, res) => {
  const resultado = await clienteService.listar(req.query);
  res.json({ ok: true, ...resultado });
});

const obtener = asyncHandler(async (req, res) => {
  const cliente = await clienteService.obtenerPorId(req.params.id);
  res.json({ ok: true, data: cliente });
});

const crear = asyncHandler(async (req, res) => {
  const cliente = await clienteService.crear(req.body);
  res.status(201).json({ ok: true, data: cliente });
});

const actualizar = asyncHandler(async (req, res) => {
  const cliente = await clienteService.actualizar(req.params.id, req.body);
  res.json({ ok: true, data: cliente });
});

const eliminar = asyncHandler(async (req, res) => {
  await clienteService.eliminar(req.params.id);
  res.status(204).send();
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
