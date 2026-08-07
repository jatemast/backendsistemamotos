const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

const ESTADOS = ['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'];

class Orden extends Model {}

Orden.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    moto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'motos', key: 'id' },
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'clientes', key: 'id' },
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    descripcion_falla: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: 'La descripcion de la falla es obligatoria' } },
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM(...ESTADOS),
      allowNull: false,
      defaultValue: 'RECIBIDA',
    },
    responsable: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Orden',
    tableName: 'ordenes',
  }
);

Orden.ESTADOS = ESTADOS;

module.exports = Orden;
