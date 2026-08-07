const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Moto extends Model {}

Moto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    placa: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: { msg: 'Ya existe una moto registrada con esa placa' },
      set(value) {
        this.setDataValue('placa', String(value).toUpperCase().trim());
      },
    },
    marca: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { notEmpty: { msg: 'La marca es obligatoria' } },
    },
    modelo: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { notEmpty: { msg: 'El modelo es obligatorio' } },
    },
    cilindraje: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: { args: [0], msg: 'El cilindraje no puede ser negativo' } },
    },
    color: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    kilometraje: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: { min: { args: [0], msg: 'El kilometraje no puede ser negativo' } },
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'clientes', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Moto',
    tableName: 'motos',
  }
);

module.exports = Moto;
