const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
// DATO:
// CUANDO SE GENERA SE SOLICITA DESDE EL FRONT UN NUEVO TOKEN (ACCESSCODE)
// DEBEMOS HACER LO MISMO, PROBABLEMENTE CON UN BEFOREUPDATE.
Invitation.beforeCreate(invitations => {
  return new Promise(async resolved => {
    const randomString = Math.random().toString(36);
    const accessCode = await bcrypt.hash(randomString, 2);
    resolved((invitations.accessCode = accessCode));
  });
});
module.exports = Invitation;
