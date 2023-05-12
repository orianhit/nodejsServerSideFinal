// Orian Dabod 308337062
// Lital Kraft 314806647

// Require Mongoose
const mongoose = require('mongoose');
const {categoriesOptions} = require('../utils/options.js');

// Define a schema
const Schema = mongoose.Schema;

const costsSchema = new Schema({
    user_id: {type: Number, required: true},
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true},
    id: {
        type: Number,
        index: true,
        auto: true,
    },
    description: {type: String, required: true},
    category: {
        type: String,
        enum: categoriesOptions,
        default: 'other',
        index: true,
    },
    sum: {type: Number, default: 0},
});


const Costs = mongoose.model('Costs', costsSchema);

costsSchema.index({year: 1, month: 1, user_id: 1})

module.exports = {
    'costsSchema': costsSchema,
    'Costs': Costs,
}