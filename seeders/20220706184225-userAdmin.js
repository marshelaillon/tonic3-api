'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456789', 12);
    return queryInterface.bulkInsert('users', [{
      userName: 'Admin',
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      isAdmin: true,
      profilePicture: 'https://www.pngitem.com/pimgs/m/24-248366_profile-clipart-generic-user-generic-profile-picture-gender.png',
      genre: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()

    }])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', null, {})
  }
};
