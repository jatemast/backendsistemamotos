const asyncHandler = require('../utils/asyncHandler');
const motoService = require('../services/moto.service');

const listar = asyncHandler(async (req, res) => {
  const resultado = await motoService.listar(req.query);
  res.json({ ok: true, ...resultado });
});

const obtener = asyncHandler(async (req, res) => {
  const moto = await motoService.obtenerPorId(req.params.id);
  res.json({ ok: true, data: moto });
});

const crear = asyncHandler(async (req, res) => {
  const moto = await motoService.crear(req.body);
  res.status(201).json({ ok: true, data: moto });
});

const actualizar = asyncHandler(async (req, res) => {
  const moto = await motoService.actualizar(req.params.id, req.body);
  res.json({ ok: true, data: moto });
});

const eliminar = asyncHandler(async (req, res) => {
  await motoService.eliminar(req.params.id);
  res.status(204).send();
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
