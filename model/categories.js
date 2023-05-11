// Orian Dabod 308337062
// Lital Kraft 314806647

// Require Mongoose
const mongoose = require('mongoose');
const {categoriesOptions} = require('../utils/options.js');

// Define a schema
const Schema = mongoose.Schema;

const costsSubSchema = new Schema({
    day: Number,
    description: String,
    sum: {type: Number, default: 0},
}, { _id: false });

const categoriesSchema = new Schema({
    name: {
        type: String,
        enum: categoriesOptions,
        default: 'other',
        unique: true,
    },
    year: Number,
    month: Number,
    user_id: {type: Number},
    categoryCosts: [costsSubSchema],
});

categoriesSchema.index({ name: 1, year: 1, month: 1, user_id: 1 }, { unique: true })

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = {
    'categoriesSchema': categoriesSchema,
    'Categories': Categories,
}