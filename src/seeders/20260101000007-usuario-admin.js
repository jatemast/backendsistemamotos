'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const password_hash = await bcrypt.hash('Pavas2026*', 10);
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador Taller',
        email: 'admin@pavasmotor.com',
        password_hash,
        rol: 'ADMIN',
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('usuarios', { email: 'admin@pavasmotor.com' }, {});
  },
};
