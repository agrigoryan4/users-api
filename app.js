const express = require('express');
const morgan = require('morgan');
const { serverHost, serverPort } = require('./config').development;
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

const run = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Connected to db');
  app.listen(serverPort, serverHost, () => {
    console.log(`Server listening on ${serverHost}:${serverPort}`);
  });
};

run();
