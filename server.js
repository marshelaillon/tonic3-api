const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const express = require('express');
const db = require('./db');
const routes = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 5432;
const models = require('./models');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load('./api.yaml');

corsOptions = {
  origin: ['http://localhost:3000', 'https://virtualeventst3.netlify.app'],
  credentials: true,
};

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['https://virtualeventst3.netlify.app', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(morgan('tiny'));
// app.use(express.static('public'));

app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

(async () => {
  try {
    await db.sync({ force: false });
    app.listen(5432, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Unable to connect:', error.message);
  }
})();
