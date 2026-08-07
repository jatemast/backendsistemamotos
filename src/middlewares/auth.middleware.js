const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

function requiereAutenticacion(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new ApiError(401, 'No autenticado. Debes iniciar sesion.'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    next(new ApiError(401, 'Sesion invalida o expirada. Vuelve a iniciar sesion.'));
  }
}

function requiereRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new ApiError(401, 'No autenticado. Debes iniciar sesion.'));
    }
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return next(new ApiError(403, 'No tienes permisos para realizar esta accion.'));
    }
    next();
  };
}

module.exports = requiereAutenticacion;
module.exports.requiereRol = requiereRol;
