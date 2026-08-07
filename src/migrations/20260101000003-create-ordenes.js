'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ordenes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      moto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'motos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      fecha_ingreso: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      fecha_entrega: { type: Sequelize.DATE, allowNull: true },
      descripcion_falla: { type: Sequelize.TEXT, allowNull: false },
      observaciones: { type: Sequelize.TEXT, allowNull: true },
      estado: {
        type: Sequelize.ENUM('RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'),
        allowNull: false,
        defaultValue: 'RECIBIDA',
      },
      responsable: { type: Sequelize.STRING(100), allowNull: true },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('ordenes', ['estado']);
    await queryInterface.addIndex('ordenes', ['moto_id']);
    await queryInterface.addIndex('ordenes', ['cliente_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('ordenes');
  },
};
