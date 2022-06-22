const S = require('sequelize');
const db = require('../db');

class Invitation extends S.Model {}

Invitation.init(
  {
    guestEmail: {
      type: S.STRING,
      allowNull: false,
    },
    accessCode: {
      type: S.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: 'invitations' }
);

module.exports = Invitation;
