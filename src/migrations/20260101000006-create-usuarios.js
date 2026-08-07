'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(100), allowNull: false },
      rol: {
        type: Sequelize.ENUM('ADMIN', 'RECEPCION', 'MECANICO'),
        allowNull: false,
        defaultValue: 'RECEPCION',
      },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('usuarios', ['email']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('usuarios');
  },
};
