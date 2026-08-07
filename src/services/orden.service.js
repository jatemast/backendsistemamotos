const { Orden, Moto, Cliente, Item, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, buildPaginationResponse } = require('../utils/pagination');
const { validarTransicion } = require('./estadoOrden');

const INCLUDE_BASICO = [
  { model: Moto, as: 'moto', attributes: ['id', 'placa', 'marca', 'modelo'] },
  { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'telefono'] },
];

async function listar(query) {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  if (query.estado) where.estado = query.estado;
  if (query.cliente_id) where.cliente_id = query.cliente_id;
  if (query.moto_id) where.moto_id = query.moto_id;

  const { count, rows } = await Orden.findAndCountAll({
    where,
    limit,
    offset,
    order: [['fecha_ingreso', 'DESC']],
    include: INCLUDE_BASICO,
  });

  return buildPaginationResponse(count, rows, page, limit);
}

async function obtenerPorId(id) {
  const orden = await Orden.findByPk(id, {
    include: [...INCLUDE_BASICO, { model: Item, as: 'items', order: [['created_at', 'ASC']] }],
  });
  if (!orden) throw ApiError.notFound('Orden de trabajo no encontrada');
  return orden;
}

async function crear(datos) {
  const moto = await Moto.findByPk(datos.moto_id);
  if (!moto) throw ApiError.badRequest('No se puede crear la orden: la moto indicada no existe.');

  // El cliente propietario se toma de la moto para evitar inconsistencias,
  // pero se permite indicarlo explicitamente si coincide con el dueno real.
  const cliente_id = datos.cliente_id || moto.cliente_id;
  const cliente = await Cliente.findByPk(cliente_id);
  if (!cliente) throw ApiError.badRequest('No se puede crear la orden: el cliente indicado no existe.');

  return Orden.create({
    moto_id: moto.id,
    cliente_id: cliente.id,
    descripcion_falla: datos.descripcion_falla,
    observaciones: datos.observaciones || null,
    responsable: datos.responsable || null,
    fecha_ingreso: datos.fecha_ingreso || new Date(),
    estado: 'RECIBIDA',
  });
}

async function actualizar(id, datos) {
  const orden = await Orden.findByPk(id);
  if (!orden) throw ApiError.notFound('Orden de trabajo no encontrada');

  if (orden.estado === 'ENTREGADA' || orden.estado === 'CANCELADA') {
    throw ApiError.badRequest(`No se puede modificar una orden en estado "${orden.estado}".`);
  }

  const camposPermitidos = ['descripcion_falla', 'observaciones', 'responsable'];
  const cambios = {};
  camposPermitidos.forEach((campo) => {
    if (datos[campo] !== undefined) cambios[campo] = datos[campo];
  });

  await orden.update(cambios);
  return orden;
}

async function cambiarEstado(id, nuevoEstado) {
  const orden = await Orden.findByPk(id);
  if (!orden) throw ApiError.notFound('Orden de trabajo no encontrada');

  validarTransicion(orden.estado, nuevoEstado);

  const cambios = { estado: nuevoEstado };
  if (nuevoEstado === 'ENTREGADA') {
    cambios.fecha_entrega = new Date();
  }

  await orden.update(cambios);
  return orden;
}

async function eliminar(id) {
  const orden = await Orden.findByPk(id);
  if (!orden) throw ApiError.notFound('Orden de trabajo no encontrada');

  if (['ENTREGADA'].includes(orden.estado)) {
    throw ApiError.conflict('No se puede eliminar una orden ya entregada.');
  }

  await sequelize.transaction(async (t) => {
    await Item.destroy({ where: { orden_id: id }, transaction: t });
    await orden.destroy({ transaction: t });
  });
}

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado, eliminar };
