/**
 * Evita repetir try/catch en cada controlador (principio DRY).
 * Envuelve un controlador async y reenvia cualquier error al middleware central.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
