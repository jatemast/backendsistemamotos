const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

const TIPOS = ['MANO_DE_OBRA', 'REPUESTO'];

class Item extends Model {}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ordenes', key: 'id' },
    },
    tipo: {
      type: DataTypes.ENUM(...TIPOS),
      allowNull: false,
      defaultValue: 'REPUESTO',
    },
    descripcion: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'La descripcion del item es obligatoria' } },
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1,
      validate: { min: { args: [0.01], msg: 'La cantidad debe ser mayor que cero' } },
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'El precio no puede ser negativo' } },
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
  }
);

Item.TIPOS = TIPOS;

module.exports = Item;
