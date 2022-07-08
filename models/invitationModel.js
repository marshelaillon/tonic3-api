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

Invitation.beforeCreate(async invitations => {
  await invitations.updateToken();
});

Invitation.prototype.setSend = function () {
  this.setDataValue('send', !this.getDataValue('send'));
  this.save();
};
Invitation.prototype.updateToken = async function () {
  try {
    const randomString = Math.random().toString(36);
    const accessCode = (await bcrypt.hash(randomString, 2)).slice(0, 20);
    this.accessCode = accessCode;
    console.log('este es el nuevo acces  code', this.accessCode);
    this.save();
    return accessCode;
  } catch (error) {
    return error;
  }
};
module.exports = Invitation;
