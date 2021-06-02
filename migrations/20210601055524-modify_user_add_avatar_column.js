'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users',
      'avatar',
      {
        type: Sequelize.STRING
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumns('Users', 'avatar');
  }
};
