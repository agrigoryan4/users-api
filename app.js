const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const responseHandler = require('./middleware/responseHandler');
const usersRouter = require('./routes/users');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use((req, res, next) => {
    res.respData = {};
    next();
});

app.use('/users', usersRouter);

app.use(responseHandler);
app.use(errorHandler);

app.listen(3000, 'localhost', () => {
    console.log('Server listening');
});
