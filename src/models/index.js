const sequelize = require('../config/database');
const Cliente = require('./cliente.model');
const Moto = require('./moto.model');
const Orden = require('./orden.model');
const Item = require('./item.model');
const Usuario = require('./usuario.model');

// Relaciones
Cliente.hasMany(Moto, { foreignKey: 'cliente_id', as: 'motos', onDelete: 'RESTRICT' });
Moto.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

Cliente.hasMany(Orden, { foreignKey: 'cliente_id', as: 'ordenes', onDelete: 'RESTRICT' });
Orden.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

Moto.hasMany(Orden, { foreignKey: 'moto_id', as: 'ordenes', onDelete: 'RESTRICT' });
Orden.belongsTo(Moto, { foreignKey: 'moto_id', as: 'moto' });

Orden.hasMany(Item, { foreignKey: 'orden_id', as: 'items', onDelete: 'CASCADE' });
Item.belongsTo(Orden, { foreignKey: 'orden_id', as: 'orden' });

/**
 * Recalcula el subtotal de un item y el total de la orden a la que pertenece.
 * Se ejecuta automaticamente cada vez que un item se crea, actualiza o elimina,
 * para que el total de la orden nunca quede desincronizado (regla de negocio:
 * "Recalcular total automaticamente").
 */
async function recalcularTotalOrden(ordenId, transaction) {
  const items = await Item.findAll({ where: { orden_id: ordenId }, transaction });
  const total = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  await Orden.update(
    { total: total.toFixed(2) },
    { where: { id: ordenId }, transaction }
  );
}

Item.beforeSave((item) => {
  const cantidad = Number(item.cantidad);
  const precio = Number(item.precio_unitario);
  item.subtotal = Number((cantidad * precio).toFixed(2));
});

Item.afterSave(async (item, options) => {
  await recalcularTotalOrden(item.orden_id, options.transaction);
});

Item.afterDestroy(async (item, options) => {
  await recalcularTotalOrden(item.orden_id, options.transaction);
});

module.exports = { sequelize, Cliente, Moto, Orden, Item, Usuario, recalcularTotalOrden };
