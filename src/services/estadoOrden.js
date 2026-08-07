const ApiError = require('../utils/ApiError');

/**
 * Flujo de negocio exigido por la prueba tecnica de Pavas:
 *
 *   RECIBIDA -> DIAGNOSTICO -> EN_PROCESO -> LISTA -> ENTREGADA
 *
 * CANCELADA se permite desde cualquier estado, EXCEPTO desde ENTREGADA.
 * Cualquier otra transicion no listada aqui es invalida.
 */
const TRANSICIONES_VALIDAS = {
  RECIBIDA: ['DIAGNOSTICO', 'CANCELADA'],
  DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO: ['LISTA', 'CANCELADA'],
  LISTA: ['ENTREGADA', 'CANCELADA'],
  ENTREGADA: [],
  CANCELADA: [],
};

function validarTransicion(estadoActual, estadoNuevo) {
  const permitidos = TRANSICIONES_VALIDAS[estadoActual];

  if (!permitidos) {
    throw ApiError.badRequest(`El estado actual "${estadoActual}" no es reconocido.`);
  }

  if (estadoActual === estadoNuevo) {
    throw ApiError.badRequest(`La orden ya se encuentra en el estado "${estadoActual}".`);
  }

  if (!permitidos.includes(estadoNuevo)) {
    throw ApiError.badRequest(
      `Transicion invalida: no se puede pasar de "${estadoActual}" a "${estadoNuevo}". ` +
        `Estados permitidos desde "${estadoActual}": ${permitidos.length ? permitidos.join(', ') : 'ninguno (estado final)'}.`
    );
  }
}

module.exports = { TRANSICIONES_VALIDAS, validarTransicion };
