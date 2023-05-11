// Orian Dabod 308337062
// Lital Kraft 314806647

// Require Mongoose
const mongoose = require('mongoose');
const {categoriesOptions} = require('../utils/options.js');

// Define a schema
const Schema = mongoose.Schema;

const costsSchema = new Schema({
    user_id: {type: Number},
    year: Number,
    month: Number,
    day: Number,
    id: {
        type: Number,
        index: true,
        auto: true,
    },
    description: String,
    category: {
        type: String,
        enum: categoriesOptions,
        default: 'other',
        index: true,
    },
    sum: {type: Number, default: 0},
});


const Costs = mongoose.model('Costs', costsSchema);

module.exports = {
    'costsSchema': costsSchema,
    'Costs': Costs,
}