require('dotenv').config();
const { SERVER_HOST, SERVER_PORT } = process.env;
const express = require('express');
const morgan = require('morgan');
// db
const { connect: connectToDb } = require('./models/database');
// middleware
const errorHandler = require('./middleware/errorHandler');
const responseHandler = require('./middleware/responseHandler');
// routes
const { authRouter, usersRouter } = require('./routes/');



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
    await connectToDb();
    console.log('Connected to db');
    app.listen(SERVER_PORT, SERVER_HOST, () => {
        console.log(`Server listening on ${SERVER_HOST}:${SERVER_PORT}`);
    });
}

run();
