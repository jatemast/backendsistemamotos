'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clientes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(120), allowNull: false },
      documento: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      telefono: { type: Sequelize.STRING(20), allowNull: false },
      email: { type: Sequelize.STRING(120), allowNull: true },
      direccion: { type: Sequelize.STRING(200), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('clientes', ['documento']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('clientes');
  },
};
