// Orian Dabod 308337062
// Lital Kraft 314806647

const express = require('express');
const router = express.Router();
const {categoriesOptions} = require('../utils/options.js');
const {isEmpty, InputValidationError} = require('../utils/inputValidations.js');
const {Costs} = require('../model/costs.js');
const {Categories} = require('../model/categories.js');
const {Users} = require('../model/users.js');
const {format2Digits, currentMonth, currentYear} = require("../utils/date");

/* GET home page. */
router.get('/', function (req, res, next) {
    try {
        res.status(200).json({title: 'Orian And Lital - HIT'});
    } catch (err) {
        next(err);
    }
});

router.get('/clear', async function (req, res, next) {
    try {
        await Categories.deleteMany({});
        await Costs.deleteMany({});
        res.status(200).json({message: 'success'})
    } catch (err) {
        next(err);
    }
})

router.post('/addcost', async function (req, res, next) {
    try {
        const user_id = req.body.user_id;
        const description = req.body.description;
        const category = req.body.category;
        const sum = req.body.sum;
        const year = req.body.year;
        const month = req.body.month;
        const day = req.body.day;

        [['year', year], ['month', month], ['day', day], ['category', category], ['sum', sum],
            ['user_id', user_id], ['description', description]].forEach(function (field) {
            if (isEmpty(field[1])) {
                throw new inputValidations.InputValidationError(`missing field ${field[0]}`);
            }
        })

        const isUserIdExists = await Users.find({id: user_id});
        if (isUserIdExists.length === 0) {
            throw new InputValidationError(`user id ${user_id} does not exists`);
        }

        const cost = await Costs.create({
            user_id: user_id,
            description: description,
            category: category,
            sum: sum,
            year: year,
            month: format2Digits(month),
            day: format2Digits(day),
        });

        res.json(cost);
    } catch (err) {
        next(err);
    }
})

router.get('/report', async function (req, res, next) {
    try {
        const year = req.query.year;
        const month = req.query.month;
        const user_id = req.query.user_id;

        [['year', year], ['month', month], ['user_id', user_id]].forEach(function (field) {
            if (isEmpty(field[1])) {
                throw new InputValidationError(`missing field ${field[0]}`);
            }
        })

        let cachedCategory = await Categories.find({year: Number(year), month: Number(month), user_id: user_id});

        if (cachedCategory.length === 0) {

            const costs = await Costs.find({year: Number(year), month: Number(month)});
            cachedCategory = costs.reduce((groups, cost) => {
                (groups[cost.category] = groups[cost.category] || []).push({
                    day: cost.day,
                    description: cost.description,
                    sum: cost.sum,
                });
                return groups;
            }, {});

            if (Number(year) !== currentYear() || Number(month) !== currentMonth()) {
                await Categories.create({
                    ...cachedCategory,
                    year: Number(year),
                    month: Number(month),
                    user_id: user_id,
                });
            }
        } else {
            cachedCategory = cachedCategory[0];
        }

        res.json({
            food: cachedCategory.food || [],
            health: cachedCategory.health || [],
            housing: cachedCategory.housing || [],
            sport: cachedCategory.sport || [],
            education: cachedCategory.education || [],
            transportation: cachedCategory.transportation || [],
            other: cachedCategory.other || [],
        });
    } catch (err) {
        next(err);
    }
})

router.get('/about', (req, res, next) => {
    try {
        res.json([
            {firstname: 'Orian', lastname: 'Dabod', id: 308337062, email: 'oriandabud@gmail.com'},
            {firstname: 'Lital', lastname: 'Kraft', id: 314806647, email: 'Litalkraft19@gmail.com'},
        ])
    } catch (err) {
        next(err);
    }
})

module.exports = router;
