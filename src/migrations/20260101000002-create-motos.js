'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('motos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      placa: { type: Sequelize.STRING(15), allowNull: false, unique: true },
      marca: { type: Sequelize.STRING(60), allowNull: false },
      modelo: { type: Sequelize.STRING(60), allowNull: false },
      cilindraje: { type: Sequelize.INTEGER, allowNull: true },
      color: { type: Sequelize.STRING(40), allowNull: true },
      kilometraje: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      observaciones: { type: Sequelize.TEXT, allowNull: true },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('motos', ['placa']);
    await queryInterface.addIndex('motos', ['cliente_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('motos');
  },
};
