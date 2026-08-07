const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Usuario extends Model {}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'El nombre es obligatorio' } },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: { msg: 'Ya existe un usuario registrado con ese correo' },
      validate: { isEmail: { msg: 'El correo no tiene un formato valido' } },
    },
    password_hash: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'RECEPCION', 'MECANICO'),
      allowNull: false,
      defaultValue: 'RECEPCION',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    defaultScope: {
      attributes: { exclude: ['password_hash'] },
    },
    scopes: {
      conClave: { attributes: { include: ['password_hash'] } },
    },
  }
);

module.exports = Usuario;
