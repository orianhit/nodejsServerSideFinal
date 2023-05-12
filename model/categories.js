// Orian Dabod 308337062
// Lital Kraft 314806647

// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const costsSubSchema = new Schema({
    day: Number,
    description: String,
    sum: {type: Number, default: 0},
}, {_id: false});

const categoriesSchema = new Schema({
    food: [costsSubSchema],
    health: [costsSubSchema],
    housing: [costsSubSchema],
    sport: [costsSubSchema],
    education: [costsSubSchema],
    transportation: [costsSubSchema],
    other: [costsSubSchema],

    year: {type: Number, required: true},
    month: {type: Number, required: true},
    user_id: {type: Number, required: true},
});

categoriesSchema.index({year: 1, month: 1, user_id: 1}, {unique: true});

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = {
    'categoriesSchema': categoriesSchema,
    'Categories': Categories,
}