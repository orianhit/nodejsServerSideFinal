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
  // Field representing the user ID, required for each document.
  year: { type: Number, required: true },
  // Field representing the year, required for each document.
  month: { type: Number, required: true },
  // Field representing the month, required for each document.
  day: { type: Number, required: true },
  // Field representing the day, required for each document.
  id: {
    type: Number,
    index: true,
    unique: true,
  }, // Field representing the ID, with indexing and uniqueness constraints.
  description: { type: String, required: true },
  // Field representing the description, required for each document.
  category: {
    type: String,
    enum: categoriesOptions,
    // Field representing the category, with predefined options from categoriesOptions.
    default: 'other',
    // Default value set to 'other' if no category is specified.
    index: true,
  },
  sum: { type: Number, required: true },
  // Field representing the sum, required for each document.
});

// Define a custom method 'toJSON' to remove unnecessary fields from the document
// before converting to JSON.
costsSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

// Create a model for the costs collection using the defined schema.
const Costs = mongoose.model('Costs', costsSchema);

// Add an index to the costs collection that is unique on the year, month, and user_id fields.
costsSchema.index({ year: 1, month: 1, user_id: 1 });

// Export the costsSchema and Costs objects for use in other modules.
module.exports = {
  costsSchema,
  Costs,
};
