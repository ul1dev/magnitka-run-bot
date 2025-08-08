'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Races', {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      cardTitle: { type: Sequelize.STRING },
      cardDates: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },

      isRegBtn: { type: Sequelize.BOOLEAN, defaultValue: false },
      regBtnUrl: { type: Sequelize.STRING },
      regBtnTextColor: { type: Sequelize.STRING },
      regBtnBgColor: { type: Sequelize.STRING },
      regBtnBorderColor: { type: Sequelize.STRING },

      isMoreBtn: { type: Sequelize.BOOLEAN, defaultValue: false },
      moreBtnTextColor: { type: Sequelize.STRING },
      moreBtnBgColor: { type: Sequelize.STRING },
      moreBtnBorderColor: { type: Sequelize.STRING },

      bgColor: { type: Sequelize.STRING },
      cardBgImg: { type: Sequelize.STRING },

      btnsPosition: {
        type: Sequelize.ENUM(
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
          'center',
        ),
      },

      date: { type: Sequelize.STRING, allowNull: false },

      mainBgImg: { type: Sequelize.STRING },
      mainBgColor: { type: Sequelize.STRING },
      mainTextColor: { type: Sequelize.STRING },
      datesTextColor: { type: Sequelize.STRING },
      datesNumsText: { type: Sequelize.STRING },
      datesMonthText: { type: Sequelize.STRING },

      aboutImgs: { type: Sequelize.JSON },
      dateAndPlaceText: { type: Sequelize.STRING, allowNull: false },
      participantPackageText: { type: Sequelize.TEXT },
      participantPackageImgs: { type: Sequelize.JSON },
      routesImgs: { type: Sequelize.JSON },
      routesText: { type: Sequelize.TEXT },

      partners: { type: Sequelize.JSON },

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
    await queryInterface.dropTable('Races');
  },
};
