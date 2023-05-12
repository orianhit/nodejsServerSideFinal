// Orian Dabod 308337062
// Lital Kraft 314806647

const express = require('express');
const mongoose = require('mongoose');
const mongo = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const inputValidations = require('./utils/inputValidations.js');

require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;


// view engine setup
app.use(logger('prod'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(function (err, req, res, next) {
    if (err instanceof mongoose.Error) {
        return res.status(400).json({error: err.message});
    } else if (err instanceof mongo.MongoError) {
        return res.status(400).json({error: err.message});
    } else if (err instanceof inputValidations.InputValidationError) {
        return res.status(400).json({error: err.message});
    }
    // pass the error to the default error handler
    return next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({message: 'Invalid path'});
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;