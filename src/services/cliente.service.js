const { Op } = require('sequelize');
const { Cliente, Moto, Orden } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, buildPaginationResponse } = require('../utils/pagination');

async function listar(query) {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  if (query.buscar) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${query.buscar}%` } },
      { documento: { [Op.like]: `%${query.buscar}%` } },
      { telefono: { [Op.like]: `%${query.buscar}%` } },
    ];
  }

  const { count, rows } = await Cliente.findAndCountAll({
    where,
    limit,
    offset,
    order: [['nombre', 'ASC']],
  });

  return buildPaginationResponse(count, rows, page, limit);
}

async function obtenerPorId(id) {
  const cliente = await Cliente.findByPk(id, {
    include: [
      { model: Moto, as: 'motos' },
      { model: Orden, as: 'ordenes', order: [['fecha_ingreso', 'DESC']] },
    ],
  });
  if (!cliente) throw ApiError.notFound('Cliente no encontrado');
  return cliente;
}

async function crear(datos) {
  return Cliente.create(datos);
}

async function actualizar(id, datos) {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) throw ApiError.notFound('Cliente no encontrado');
  await cliente.update(datos);
  return cliente;
}

async function eliminar(id) {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) throw ApiError.notFound('Cliente no encontrado');

  const motos = await Moto.count({ where: { cliente_id: id } });
  if (motos > 0) {
    throw ApiError.conflict('No se puede eliminar el cliente: tiene motos registradas asociadas.');
  }

  await cliente.destroy();
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
