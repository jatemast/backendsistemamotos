const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const ApiError = require('../utils/ApiError');

const JWT_EXPIRES_IN = '12h';

function firmarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function login(email, password) {
  if (!email || !password) {
    throw ApiError.badRequest('Debes indicar correo y contraseña.');
  }

  const usuario = await Usuario.scope('conClave').findOne({ where: { email: email.toLowerCase().trim() } });
  if (!usuario || !usuario.activo) {
    throw ApiError.badRequest('Credenciales invalidas.');
  }

  const coincide = await bcrypt.compare(password, usuario.password_hash);
  if (!coincide) {
    throw ApiError.badRequest('Credenciales invalidas.');
  }

  const token = firmarToken(usuario);
  const { password_hash, ...usuarioSinClave } = usuario.toJSON();

  return { token, usuario: usuarioSinClave };
}

async function perfil(usuarioId) {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) throw ApiError.notFound('Usuario no encontrado');
  return usuario;
}

module.exports = { login, perfil };
