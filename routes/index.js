// Orian Dabod 308337062
// Lital Kraft 314806647

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {isEmpty, InputValidationError} = require('../utils/inputs.js');
const {getNextSequence} = require('../utils/mongo.js');
const {Costs} = require('../model/costs.js');
const {Reports} = require('../model/reports.js');
const {Users} = require('../model/users.js');

// Define a route that responds to GET requests to the / path.
router.get('/', function (req, res, next) {
    try {
        // Send the title of the website to the client.
        res.status(200).json({title: 'Orian And Lital - HIT'});
    } catch (err) {
        // Log the error.
        console.error(err);

        // Pass the error to the next middleware.
        next(err);
    }
});

// Define a route that responds to GET requests to the /clear path.
router.get('/clear', async function (req, res, next) {
    // Try to delete all reports and costs from the database.
    try {
        await Reports.deleteMany({});
        await Costs.deleteMany({});

        // Send a success message to the client.
        res.status(200).json({message: 'success'});
    } catch (err) {
        // Log the error.
        console.error(err);

        // Pass the error to the next middleware.
        next(err);
    }
})

// Define a route that responds to POST requests to the /addcost path.
router.post('/addcost', async function (req, res, next) {
    try {
        // Get the user ID, description, category, sum, year, month, and day from the request body.
        const user_id = req.body.user_id;
        const description = req.body.description;
        const category = req.body.category;
        const sum = req.body.sum;
        const year = req.body.year;
        const month = req.body.month;
        const day = req.body.day;

        // Validate that the year, month, day, user ID, description, category, and sum are not empty.
        [['year', year], ['month', month], ['day', day], ['category', category], ['sum', sum],
            ['user_id', user_id], ['description', description]].forEach(function (field) {
            if (isEmpty(field[1])) {
                throw new InputValidationError(`missing field ${field[0]}`);
            }
        })

        // Check if the user exists in the database.
        const isUserIdExists = await Users.find({id: user_id});
        if (isUserIdExists.length === 0) {
            throw new InputValidationError(`user id ${user_id} does not exists`);
        }

        const session = await mongoose.startSession();

        session.startTransaction();

        try {
            // Create a new cost document in the database.
            const cost = await Costs.create({
                id: await getNextSequence('costs'),
                user_id: user_id,
                description: description,
                category: category,
                sum: sum,
                year: year,
                month: month,
                day: day,
            });

            //  Delete computed result for this month
            await Reports.deleteOne({
                year: year,
                month: month,
                user_id: user_id
            })

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
})

// Define a route that responds to GET requests to the /report path.
router.get('/report', async function (req, res, next) {
    try {
        // Get the year, month, and user ID from the request query parameters.
        const year = req.query.year;
        const month = req.query.month;
        const user_id = req.query.user_id;

        // Validate that the year, month, and user ID are not empty.
        [['year', year], ['month', month], ['user_id', user_id]].forEach(function (field) {
            if (isEmpty(field[1])) {
                throw new InputValidationError(`missing field ${field[0]}`);
            }
        })

        // Check if the user exists in the database.
        const isUserIdExists = await Users.find({id: user_id});
        if (isUserIdExists.length === 0) {
            throw new InputValidationError(`user id ${user_id} does not exists`);
        }

        // Get the cached report for the given year, month, and user ID.
        let cachedReport = await Reports.findOne({year: Number(year), month: Number(month), user_id: user_id});

        // If there is no cached report, create a new one.
        if (!cachedReport) {

            // Get the costs for the given year, month, and user ID.
            const costs = await Costs.find({year: Number(year), month: Number(month), user_id: Number(user_id)});

            // Create a new report from the costs.
            cachedReport = costs.reduce((groups, cost) => {
                (groups[cost.category] = groups[cost.category] || []).push({
                    day: cost.day,
                    description: cost.description,
                    sum: cost.sum,
                });
                return groups;
            }, {});

            // Create Report in the database.
            await Reports.create({
                ...cachedReport,
                year: Number(year),
                month: Number(month),
                user_id: user_id,
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
})

// Define a route that responds to GET requests to the /about path.
router.get('/about', (req, res, next) => {
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
})

module.exports = router;
