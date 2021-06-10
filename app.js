const express = require('express');
const morgan = require('morgan');
const { development: { serverHost, serverPort } } = require('./config');
// db
const { sequelize } = require('./models');
// middleware
const errorHandler = require('./middleware/errorHandler');
const responseHandler = require('./middleware/responseHandler');
// routes
const { authRouter, usersRouter } = require('./routes');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
