'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShopProducts', {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      article: { type: Sequelize.STRING, allowNull: false, unique: true },
      price: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      info: { type: Sequelize.TEXT, allowNull: false },
      imgs: { type: Sequelize.JSON, allowNull: false },
      discountProcent: { type: Sequelize.INTEGER },
      description: { type: Sequelize.TEXT },
      sizesTitle: { type: Sequelize.STRING },
      sizes: { type: Sequelize.JSON },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ShopProducts');
  },
};
