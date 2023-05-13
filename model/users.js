// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for a user document.
const usersSchema = new Schema({
    id: {
        type: Number,
        index: true,
        required: true,
    },
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    birthday: {type: Date, required: true},
});

// Create a model for the users collection.
const Users = mongoose.model('Users', usersSchema);

// Export the usersSchema and Users objects.
module.exports = {
    'usersSchema': usersSchema,
    'Users': Users,
}