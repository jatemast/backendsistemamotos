const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cliente extends Model {}

Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: { msg: 'El nombre del cliente es obligatorio' } },
    },
    documento: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: { msg: 'Ya existe un cliente con ese numero de documento' },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { notEmpty: { msg: 'El telefono es obligatorio' } },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: true,
      validate: { isEmail: { msg: 'El correo no tiene un formato valido' } },
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
  }
);

module.exports = Cliente;
