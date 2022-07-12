const Sequelize = require('sequelize');
let db;

if (process.env.NODE_ENV === 'development') {
  db = new Sequelize('virtual_events', null, null, {
    dialect: 'postgres',
    host: 'localhost',
    logging: false,
  });
}

if (process.env.NODE_ENV === 'production') {
  db = new Sequelize(
    process.env.DATABASE_URL,
    'bwlmjybmuqnlve',
    'd1d24e4faacb0d3359bab3ad31fb3ca06c60f1e2f89bc075eca523f7d6d0abd4',
    {
      dialect: 'postgres',
      host: 'ec2-54-160-109-68.compute-1.amazonaws.com',
      logging: false,
      dialectOptions: {
        ssl: { 
          require: true,
          rejectUnauthorized: false 
        }
    }
  );
}

module.exports = db;
