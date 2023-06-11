// Orian Dabod 308337062
// Lital Kraft 314806647

// Define a function that checks if a string is empty.
const { User } = require('../model/user');

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
  if (year) {
    if (Number.isNaN(parseInt(year, 10))) {
      throw new InputValidationError('Year should be a number');
    }
    if (year > 2023 || year < 1900) {
      throw new InputValidationError('Year should be between 2023 and 1900');
    }
  }

  // if month param passed, check if in valid range
  if (month) {
    if (Number.isNaN(parseInt(month, 10))) {
      throw new InputValidationError('Month should be a number');
    }
    if (month > 12 || month < 1) {
      throw new InputValidationError('Month should be between 1 and 12');
    }
  }

  // if day param passed, check if in valid range
  if (day) {
    if (Number.isNaN(parseInt(day, 10))) {
      throw new InputValidationError('Day should be a number');
    }
    if (day > 31 || day < 1) {
      throw new InputValidationError('Day should be between 1 and 31');
    }
  }

  // Check if the user exists in the database.
  if (userId) {
    const isUserIdExists = await User.find({ id: userId });
    if (isUserIdExists.length === 0) {
      throw new InputValidationError(`User id ${userId} does not exist`);
    }
  }
}

// Export the InputValidationError and isEmpty functions.
module.exports = {
  InputValidationError,
  isEmpty,
  validateInput,
};
