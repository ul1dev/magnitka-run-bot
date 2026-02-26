'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MainPage', 'mainTimerDate', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '2025-09-07',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('MainPage', 'mainTimerDate');
  },
};
