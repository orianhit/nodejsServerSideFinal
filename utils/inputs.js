// Orian Dabod 308337062
// Lital Kraft 314806647

// Define a function that checks if a string is empty.
const { Users } = require('../model/users');

function isEmpty(str) {
  return (!str || str.length === 0);
}

// Define a class that represents an input validation error.
class InputValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InputValidationError';
  }
}

async function validateInput(userId, year, month, day) {
  // if year param passed, check if in valid range
  if (year && (year > 2023 || year < 1900)) {
    throw new InputValidationError('year should be between 2023 and 1900');
  }

  // if month param passed, check if in valid range
  if (month && (month > 12 || month < 1)) {
    throw new InputValidationError('month should be between 1 and 12');
  }

  // if day param passed, check if in valid range
  if (day && (day > 31 || day < 1)) {
    throw new InputValidationError('day should be between 1 and 31');
  }

  // Check if the user exists in the database.
  if (userId) {
    const isUserIdExists = await Users.find({ id: userId });
    if (isUserIdExists.length === 0) {
      throw new InputValidationError(`user id ${userId} does not exist`);
    }
  }
}

// Export the InputValidationError and isEmpty functions.
module.exports = {
  InputValidationError,
  isEmpty,
  validateInput,
};
