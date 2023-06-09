// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define a schema for a counter document.
const countersSchema = new Schema({
  // Field representing the primary key of the documents in the "Counters" collection.
  // It is of type String and is required.
  _id: { type: String, required: true },
  // Field representing the sequence number of the documents in the "Counters" collection.
  // It is of type Number and is required.
  seq: { type: Number, required: true },
});

// Create a model for the counter collection.
const Counter = mongoose.model('Counters', countersSchema);

// Export the CountersSchema and Counters objects.
module.exports = {
  countersSchema,
  Counter,
};
