// Orian Dabod 308337062
// Lital Kraft 314806647

// Import the mongoose module.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define a schema for the "users" document.
const usersSchema = new Schema({
  id: {
    type: Number,
    // Field representing the ID of the user. It is of type Number.
    index: true,
    // Create an index on the "id" field for efficient querying.
    required: true,
    // Field is required, meaning every user document must have an "id" field.
  },
  first_name: { type: String, required: true },
  // Field representing the first name of the user. It is of type String and is required.
  last_name: { type: String, required: true },
  // Field representing the last name of the user. It is of type String and is required.
  birthday: { type: Date, required: true },
  // Field representing the birthday of the user. It is of type Date and is required.
});

// Create a model for the user collection.
const User = mongoose.model('Users', usersSchema);

// Export the usersSchema and Users objects.
module.exports = {
  usersSchema,
  User: User,
};
