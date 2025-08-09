'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      deliveryMethod: { type: Sequelize.STRING, allowNull: false },
      orderMessageId: { type: Sequelize.STRING },
      paymentLink: { type: Sequelize.STRING },
      providerPaymentId: { type: Sequelize.STRING },
      provider: { type: Sequelize.STRING },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'CREATED',
      },

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
    await queryInterface.dropTable('Orders');
  },
};
