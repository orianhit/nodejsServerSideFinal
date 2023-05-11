// Orian Dabod 308337062
// Lital Kraft 314806647

const express = require('express');
const router = express.Router();
const {categoriesOptions} = require('../utils/options.js');
const {isEmpty, InputValidationError} = require('../utils/inputValidations.js');
const {Costs} = require('../model/costs.js');
const {Categories} = require('../model/categories.js');
const {Users} = require('../model/users.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    try {
        res.status(200).json({title: 'Orian And Lital - HIT'});
    } catch (err) {
        next(err);
    }
});

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

        const cost = await Costs.create(req.body);
        await Categories.findOneAndUpdate(
            {
                user_id: user_id,
                year: year,
                month: month,
                name: category
            }, {
                $push: {
                    categoryCosts: {
                        day: cost.day,
                        description: cost.description,
                        sum: cost.sum
                    }
                }
            },
            {
                timestamps: false,
                upsert: true,
                new: true
            }
        );

        res.json(cost);
    } catch (err) {
        next(err);
    }
})

router.get('/report', async function (req, res, next) {
    try {
        let response = [];
        const year = req.query.year;
        const month = req.query.month;
        const user_id = req.query.user_id;

        [['year', year], ['month', month], ['user_id', user_id]].forEach(function (field) {
            if (isEmpty(field[1])) {
                throw new InputValidationError(`missing field ${field[0]}`);
            }
        })

        for (const category of categoriesOptions) {
            const categoryObj = await Categories
                .find({name: category, year: year, month: month, user_id: user_id});
            if (categoryObj.length !== 0) {
                response.push({[category]: categoryObj[0].categoryCosts});
            } else {
                response.push({[category]: []});
            }
        }
        res.json(response);
    } catch (err) {
        next(err);
    }
})

router.get('/about', (req, res, next) => {
    try {
        res.json([
            {firstname: 'Orian', lastname: 'Dabod', id: 308337062, email: 'oriangdabud@gmail.com'},
            {firstname: 'Lital', lastname: 'Kraft', id: 314806647, email: 'Litalkraft19@gmail.com'},
        ])
    } catch (err) {
        next(err);
    }
})

module.exports = router;
