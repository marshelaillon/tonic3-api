const dotenv = require('dotenv').config();
const express = require('express');
const db = require('./db');
const routes = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3001;
const models = require('./models');

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
//app.use('/api', routes);

(async () => {
  try {
    await db.sync({ force: false });
    app.listen(3001, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Unable to connect to the database', error.message);
  }
})();
