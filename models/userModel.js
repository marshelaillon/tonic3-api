const S = require('sequelize');
const db = require('../db');

class User extends S.Model {}

User.init(
  {
    userName: {
      type: S.STRING,
      allowNull: false,
    },
    firstName: {
      type: S.STRING,
    },
    lastName: {
      type: S.STRING,
    },
    email: {
      type: S.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address',
        },
      },
    },
    password: {
      type: S.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 64],
          msg: 'Password must be between 8 and 16 characters',
        },
      },
    },
    isAdmin: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
    profilePicture: {
      type: S.TEXT,
      defaultValue:
        'https://www.pngitem.com/pimgs/m/24-248366_profile-clipart-generic-user-generic-profile-picture-gender.png',
    },
    genre: {
      type: S.STRING,
    },
  },
  { sequelize: db, modelName: 'users' }
);

module.exports = User;
