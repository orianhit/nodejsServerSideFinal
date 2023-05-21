// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Import the categoriesOptions object from the options.js file.
const { categoriesOptions } = require('../utils/options');

// Define a schema for a costs document.
const costsSchema = new Schema({
  user_id: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  id: {
    type: Number,
    index: true,
    unique: true,
  },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: categoriesOptions,
    default: 'other',
    index: true,
  },
  sum: { type: Number, required: true },
});

costsSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

// Create a model for the costs collection.
const Costs = mongoose.model('Costs', costsSchema);

// Add an index to the costs collection that is unique on the year, month, and user_id fields.
costsSchema.index({ year: 1, month: 1, user_id: 1 });

// Export the costsSchema and Costs objects.
module.exports = {
  costsSchema,
  Costs,
};
