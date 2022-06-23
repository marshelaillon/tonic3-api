const S = require('sequelize');
const db = require('../db');

class User extends S.Model {}

User.init(
  {
    firstName: {
      type: S.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 16],
          msg: 'First name must be between 6 and 16 characters',
        },
      },
    },
    lastName: {
      type: S.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 16],
          msg: 'Last name must be between 6 and 16 characters',
        },
      },
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
  },
  { sequelize: db, modelName: 'users' }
);

module.exports = User;
