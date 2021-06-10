const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { development: { serverHost, serverPort } } = require('./config');
// db
const { sequelize } = require('./models');
// middleware
const errorHandler = require('./middleware/errorHandler');
const responseHandler = require('./middleware/responseHandler');
// routes
const { authRouter, usersRouter } = require('./routes');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users API',
      version: '1.0.0',
      description: 'A simple users API',
    },
    servers: [
      {
        url: `http://${serverHost}:${serverPort}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpecs = swaggerJSDoc(swaggerOptions);

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// routes
app.use((req, res, next) => {
  res.respData = {};
  next();
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use(responseHandler);
app.use(errorHandler);

async function run() {
  app.listen(serverPort, serverHost, async () => {
    console.log(`Server listening on ${serverHost}:${serverPort}`);
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connected to db');
  });
}

run();
