'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const password_hash = await bcrypt.hash('Pavas2026*', 10);
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Recepcion Taller',
        email: 'recepcion@pavasmotor.com',
        password_hash,
        rol: 'RECEPCION',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: 'Mecanico Taller',
        email: 'mecanico@pavasmotor.com',
        password_hash,
        rol: 'MECANICO',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      'usuarios',
      { email: ['recepcion@pavasmotor.com', 'mecanico@pavasmotor.com'] },
      {}
    );
  },
};
