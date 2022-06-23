const S = require('sequelize');
const db = require('../db');

class Invitation extends S.Model {}

Invitation.init(
  {
    guestEmail: {
      type: S.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address',
        },
      },
    },
    accessCode: {
      type: S.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: 'invitations' }
);

module.exports = Invitation;
