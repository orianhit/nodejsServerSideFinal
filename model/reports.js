// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for a costs subdocument.
const costsSubSchema = new Schema({
    day: Number,
    description: String,
    sum: {type: Number, default: 0},
}, {_id: false});

// Define a schema for a reports document.
const reportsSchema = new Schema({
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

// Add an index to the reports collection that is unique on the year, month, and user_id fields.
reportsSchema.index({year: 1, month: 1, user_id: 1}, {unique: true});

// Create a model for the reports collection.
const Reports = mongoose.model('reports', reportsSchema);

// Export the reportsSchema and Reports objects.
module.exports = {
    'reportsSchema': reportsSchema,
    'Reports': Reports,
}
