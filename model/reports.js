// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define a sub-schema for the "costs" subdocument.
const costsSubSchema = new Schema({
  // Field representing the day of the cost. It is of type Number.
  day: Number,
  // Field representing the description of the cost. It is of type String.
  description: String,
  // Field representing the sum of the cost. It is of type Number with a default value of 0.
  sum: { type: Number, default: 0 },
}, { _id: false });  // Disable the generation of an _id field for the subdocument.

// Define a schema for the "reports" document.
const reportsSchema = new Schema({
  // Field representing an array of "costs" subdocuments for the "food" category.
  food: [costsSubSchema],
  // Field representing an array of "costs" subdocuments for the "health" category.
  health: [costsSubSchema],
  // Field representing an array of "costs" subdocuments for the "housing" category.
  housing: [costsSubSchema],
  // Field representing an array of "costs" subdocuments for the "sport" category.
  sport: [costsSubSchema],
  // Field representing an array of "costs" subdocuments for the "education" category.
  education: [costsSubSchema],
  // Field representing an array of "costs" subdocuments for the "transportation" category.
  transportation: [costsSubSchema],
  // Field representing an array of "costs" subdocuments for the "other" category.
  other: [costsSubSchema],

  // Field representing the year of the report. It is of type Number and is required.
  year: { type: Number, required: true },
  // Field representing the month of the report. It is of type Number and is required.
  month: { type: Number, required: true },
  // Field representing the user ID associated with the report.
  // It is of type Number and is required.
  user_id: { type: Number, required: true },
});

// Add an index to the reports collection that is unique on the year, month, and user_id fields.
reportsSchema.index({ year: 1, month: 1, user_id: 1 }, { unique: true });

// Create a model for the report collection.
const reports = mongoose.model('reports', reportsSchema);

// Export the reportsSchema and Reports objects.
module.exports = {
  reportsSchema,
  reports,
};
