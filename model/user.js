// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define a schema for the "users" document.
const usersSchema = new Schema({
  id: {
    // Field representing the ID of the user. It is of type Number.
    type: Number,
    // Create an index on the "id" field for efficient querying.
    index: true,
    // Field is required, meaning every user document must have an "id" field.
    required: true,
  },
  // Field representing the first name of the user. It is of type String and is required.
  first_name: { type: String, required: true },
  // Field representing the last name of the user. It is of type String and is required.
  last_name: { type: String, required: true },
  // Field representing the birthday of the user. It is of type Date and is required.
  birthday: { type: Date, required: true },
});

// Create a model for the user collection.
const User = mongoose.model('Users', usersSchema);

// Export the usersSchema and Users objects.
module.exports = {
  usersSchema,
  User: User,
};
