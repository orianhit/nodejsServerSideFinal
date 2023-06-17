// Orian Dabod 308337062
// Lital Kraft 314806647

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { isEmpty, InputValidationError, validateInput } = require('../utils/inputs');
const { getNextSequence } = require('../utils/mongo');
const { Cost } = require('../model/cost');
const { Report } = require('../model/report');
const { User } = require('../model/user');

// Define a route that responds to POST requests to the /addcost path.
router.post('/addcost', async function (req, res, next) {
  try {
    // Get the user ID, description, category, sum, year, month, and day from the request body.
    const { user_id: userId } = req.body;
    const { description } = req.body;
    const { category } = req.body;
    const { sum } = req.body;
    const { year } = req.body;
    const { month } = req.body;
    const { day } = req.body;

    // Validate that the year, month, day, user ID, description, category, and sum are not empty.
    [['year', year], ['month', month], ['day', day], ['category', category], ['sum', sum],
      ['user_id', userId], ['description', description]].forEach(function (field) {
      if (isEmpty(field[1])) {
        throw new InputValidationError(`Missing field ${field[0]}`);
      }
    });

    // validate date params are in valid range, and user exists in db
    await validateInput(userId, year, month, day);

    // Check if the user exists in the database.
    const isUserIdExists = await User.find({ id: userId });
    if (isUserIdExists.length === 0) {
      throw new InputValidationError(`User id ${userId} does not exists`);
    }

    const session = await mongoose.startSession();
    // start new transaction, in order to clear cache and create cost simultaneously
    session.startTransaction();

    try {
      // Create a new cost document in the database.
      const cost = await Cost.create({
        id: await getNextSequence('costs'),
        user_id: userId,
        description,
        category,
        sum,
        year,
        month,
        day,
      });

      //  Delete computed result for this month
      await Report.deleteOne({
        year,
        month,
        user_id: userId,
      });

      // Commit the changes
      await session.commitTransaction();

      // Send the cost document to the client.
      res.status(201).json(cost);
    } catch (error) {
      // Rollback any changes made in the database
      await session.abortTransaction();

      // Rethrow the error
      throw error;
    } finally {
      // Ending the session
      session.endSession();
    }
  } catch (err) {
    // Log the error.
    console.error(err);

    // Pass the error to the next middleware.
    next(err);
  }
});

// Define a route that responds to GET requests to the /report path.
router.get('/report', async function (req, res, next) {
  try {
    // Get the year, month, and user ID from the request query parameters.
    const { year } = req.query;
    const { month } = req.query;
    const { user_id: userId } = req.query;

    // Validate that the year, month, and user ID are not empty.
    [['year', year], ['month', month], ['user_id', userId]].forEach(function (field) {
      if (isEmpty(field[1])) {
        throw new InputValidationError(`Missing field ${field[0]}`);
      }
    });

    // validate date params are in valid range, and user exists in db
    await validateInput(userId, year, month);

    // Get the cached report for the given year, month, and user ID.
    let cachedReport = await Report.findOne({
      year: Number(year),
      month: Number(month),
      user_id: userId,
    });

    // If there is no cached report, create a new one.
    if (!cachedReport) {
      // Get the currentCosts for the given year, month, and user ID.
      const currentCosts = await Cost.find({
        year: Number(year),
        month: Number(month),
        user_id: Number(userId),
      });

      // Create a new report from the currentCosts.
      cachedReport = currentCosts.reduce(function (groups, cost) {
        (groups[cost.category] = groups[cost.category] || []).push({
          day: cost.day,
          description: cost.description,
          sum: cost.sum,
        });
        return groups;
      }, {});

      // Create Report in the database.
      await Report.create({
        ...cachedReport,
        year: Number(year),
        month: Number(month),
        user_id: userId,
      });
    }

    // Send the report to the client.
    // Setting empty array if category not in document AKA no cost exists
    res.json({
      food: cachedReport.food || [],
      health: cachedReport.health || [],
      housing: cachedReport.housing || [],
      sport: cachedReport.sport || [],
      education: cachedReport.education || [],
      transportation: cachedReport.transportation || [],
      other: cachedReport.other || [],
    });
  } catch (err) {
    // Log the error.
    console.error(err);

    // Pass the error to the next middleware.
    next(err);
  }
});

// Define a route that responds to GET requests to the /about path.
router.get('/about', function (req, res, next) {
  // Try to send the creators information.
  try {
    // set the creators info in variable
    const creators = [
      {
        firstname: 'Orian',
        lastname: 'Dabod',
        id: 308337062,
        email: 'oriandabud@gmail.com',
      },
      {
        firstname: 'Lital',
        lastname: 'Kraft',
        id: 314806647,
        email: 'Litalkraft19@gmail.com',
      },
    ];
    // Send the user information to the client.
    res.json(creators);
  } catch (err) {
    // Log the error.
    console.error(err);

    // Pass the error to the next middleware.
    next(err);
  }
});

module.exports = router;
