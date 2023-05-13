// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the express, mongoose, mongo, path, cookieParser, logger, and inputValidations modules.
const express = require('express');
const mongoose = require('mongoose');
const mongo = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const inputValidations = require('./utils/inputs.js');

// Load the .env file.
require('dotenv').config();

// Import the indexRouter from the routes/index.js file.
const indexRouter = require('./routes/index');

// Create a new express app.
const app = express();

// Connect to the MongoDB database.
mongoose.connect(process.env.MONGO_URL);

// Set the global Promise implementation to the one provided by mongoose.
mongoose.Promise = global.Promise;

// Configure the express app.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount the indexRouter on the '/' route.
app.use('/', indexRouter);

// Create a custom error handler that handles errors from mongoose, mongo, and inputValidations.
app.use(function (err, req, res, next) {
    if (err instanceof mongoose.Error) {
        return res.status(400).json({error: err.message});
    } else if (err instanceof mongo.MongoError) {
        return res.status(400).json({error: err.message});
    } else if (err instanceof inputValidations.InputValidationError) {
        return res.status(400).json({error: err.message});
    }
    // Pass the error to the default error handler.
    return next(err);
});

// Create a custom error handler that handles 404 errors.
app.use(function (req, res, next) {
    res.status(404).json({message: 'Invalid path'});
});

// Create a custom error handler that handles all other errors.
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

// Export the app.
module.exports = app;