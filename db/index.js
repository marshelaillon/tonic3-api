const Sequelize = require('sequelize');

const db = new Sequelize('virtual_events', null, null, {
  dialect: 'postgres',
  host: 'localhost',
  logging: false,
});

module.exports = db;
