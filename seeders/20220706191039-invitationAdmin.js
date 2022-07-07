'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('invitations', [{
      email: 'admin@admin.com',
      accessCode: 'admin',
      send: true,
      checked: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('invitations', null, {})
  }
};
