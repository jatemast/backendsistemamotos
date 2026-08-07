const ApiError = require('../utils/ApiError');

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  // Errores de validacion / unicidad de Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const details = err.errors.map((e) => ({ campo: e.path, mensaje: e.message }));
    return res.status(400).json({
      ok: false,
      message: 'Error de validacion',
      details,
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      ok: false,
      message: 'La operacion viola una relacion existente (registro referenciado en otra tabla).',
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ ok: false, message: 'Sesion invalida o expirada. Vuelve a iniciar sesion.' });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
      details: err.details || undefined,
    });
  }

  console.error('[ERROR NO CONTROLADO]', err);
  return res.status(500).json({
    ok: false,
    message: 'Ha ocurrido un error interno en el servidor.',
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ ok: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
