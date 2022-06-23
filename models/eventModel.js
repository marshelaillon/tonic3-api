const S = require('sequelize');
const db = require('../db');

class Event extends S.Model {}

Event.init(
  {
    title: {
      type: S.STRING,
      allowNull: false,
    },
    url: {
      type: S.TEXT,
      allowNull: false,
    },
    description: {
      type: S.TEXT,
      allowNull: false,
    },
    assistantsCount: {
      type: S.INTEGER,
      defaultValue: 0,
    },
    guestsCount: {
      type: S.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: S.STRING,
      defaultValue: 'pending',
    },
  },
  { sequelize: db, modelName: 'events' }
);

module.exports = Event;
