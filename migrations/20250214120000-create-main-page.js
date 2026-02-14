'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MainPage', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      mainBgImg: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      galleryFirstLineImgs: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      },
      gallerySecondLineImgs: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
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
    await queryInterface.dropTable('MainPage');
  },
};
