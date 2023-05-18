// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define a schema for a counter document.
const CountersSchema = new Schema({
    _id: {type: String, required: true},
    seq: {type: Number, required: true}
});


// Create a model for the Counters collection.
const Counters = mongoose.model('Counters', CountersSchema);

// Export the CountersSchema and Counters objects.
module.exports = {
    'CountersSchema': CountersSchema,
    'Counters': Counters,
}
