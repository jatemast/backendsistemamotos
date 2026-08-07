const { Op } = require('sequelize');
const { Moto, Cliente, Orden } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, buildPaginationResponse } = require('../utils/pagination');

async function listar(query) {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  if (query.buscar) {
    where[Op.or] = [
      { placa: { [Op.like]: `%${query.buscar.toUpperCase()}%` } },
      { marca: { [Op.like]: `%${query.buscar}%` } },
      { modelo: { [Op.like]: `%${query.buscar}%` } },
    ];
  }
  if (query.cliente_id) where.cliente_id = query.cliente_id;

  const { count, rows } = await Moto.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'telefono'] }],
  });

  return buildPaginationResponse(count, rows, page, limit);
}

async function obtenerPorId(id) {
  const moto = await Moto.findByPk(id, {
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Orden, as: 'ordenes', order: [['fecha_ingreso', 'DESC']] },
    ],
  });
  if (!moto) throw ApiError.notFound('Moto no encontrada');
  return moto;
}

async function verificarClienteExiste(cliente_id) {
  const cliente = await Cliente.findByPk(cliente_id);
  if (!cliente) throw ApiError.badRequest('El cliente propietario indicado no existe.');
  return cliente;
}

async function crear(datos) {
  await verificarClienteExiste(datos.cliente_id);

  const existente = await Moto.findOne({ where: { placa: String(datos.placa).toUpperCase().trim() } });
  if (existente) throw ApiError.conflict(`Ya existe una moto registrada con la placa ${datos.placa.toUpperCase()}.`);

  return Moto.create(datos);
}

async function actualizar(id, datos) {
  const moto = await Moto.findByPk(id);
  if (!moto) throw ApiError.notFound('Moto no encontrada');

  if (datos.cliente_id) await verificarClienteExiste(datos.cliente_id);

  if (datos.placa && datos.placa.toUpperCase().trim() !== moto.placa) {
    const existente = await Moto.findOne({ where: { placa: datos.placa.toUpperCase().trim() } });
    if (existente) throw ApiError.conflict(`Ya existe una moto registrada con la placa ${datos.placa.toUpperCase()}.`);
  }

  await moto.update(datos);
  return moto;
}

async function eliminar(id) {
  const moto = await Moto.findByPk(id);
  if (!moto) throw ApiError.notFound('Moto no encontrada');

  const ordenes = await Orden.count({ where: { moto_id: id } });
  if (ordenes > 0) {
    throw ApiError.conflict('No se puede eliminar la moto: tiene ordenes de trabajo asociadas.');
  }

  await moto.destroy();
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
