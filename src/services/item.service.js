const { Item, Orden } = require('../models');
const ApiError = require('../utils/ApiError');

async function verificarOrdenEditable(orden_id) {
  const orden = await Orden.findByPk(orden_id);
  if (!orden) throw ApiError.badRequest('La orden indicada no existe.');
  if (['ENTREGADA', 'CANCELADA'].includes(orden.estado)) {
    throw ApiError.badRequest(`No se pueden modificar los items de una orden en estado "${orden.estado}".`);
  }
  return orden;
}

async function listarPorOrden(orden_id) {
  return Item.findAll({ where: { orden_id }, order: [['created_at', 'ASC']] });
}

async function crear(orden_id, datos) {
  await verificarOrdenEditable(orden_id);

  if (Number(datos.cantidad) <= 0) throw ApiError.badRequest('La cantidad debe ser mayor que cero.');
  if (Number(datos.precio_unitario) < 0) throw ApiError.badRequest('El precio no puede ser negativo.');

  return Item.create({
    orden_id,
    tipo: datos.tipo || 'REPUESTO',
    descripcion: datos.descripcion,
    cantidad: datos.cantidad,
    precio_unitario: datos.precio_unitario,
  });
}

async function actualizar(orden_id, item_id, datos) {
  await verificarOrdenEditable(orden_id);

  const item = await Item.findOne({ where: { id: item_id, orden_id } });
  if (!item) throw ApiError.notFound('Item no encontrado en esta orden.');

  if (datos.cantidad !== undefined && Number(datos.cantidad) <= 0) {
    throw ApiError.badRequest('La cantidad debe ser mayor que cero.');
  }
  if (datos.precio_unitario !== undefined && Number(datos.precio_unitario) < 0) {
    throw ApiError.badRequest('El precio no puede ser negativo.');
  }

  await item.update(datos);
  return item;
}

async function eliminar(orden_id, item_id) {
  await verificarOrdenEditable(orden_id);

  const item = await Item.findOne({ where: { id: item_id, orden_id } });
  if (!item) throw ApiError.notFound('Item no encontrado en esta orden.');

  await item.destroy();
}

module.exports = { listarPorOrden, crear, actualizar, eliminar };
