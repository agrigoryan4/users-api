const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/users');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use('/user', userRouter);

app.listen(3000, 'localhost', () => {
    console.log('Server listening');
});
