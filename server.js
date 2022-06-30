const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const express = require('express');
const db = require('./db');
const routes = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3001;
const models = require('./models');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load('./api.yaml');

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: false }));
app.use(morgan('tiny'));

app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

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
