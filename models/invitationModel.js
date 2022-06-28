const S = require('sequelize');
const db = require('../db');

class Invitation extends S.Model {}

Invitation.init(
  {
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
    accessCode: {
      type: S.STRING,
    },
    send: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
    checked: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize: db, modelName: 'invitations' }
);

module.exports = Invitation;
