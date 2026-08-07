'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orden_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ordenes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tipo: {
        type: Sequelize.ENUM('MANO_DE_OBRA', 'REPUESTO'),
        allowNull: false,
        defaultValue: 'REPUESTO',
      },
      descripcion: { type: Sequelize.STRING(150), allowNull: false },
      cantidad: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },
      precio_unitario: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('items', ['orden_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('items');
  },
};
