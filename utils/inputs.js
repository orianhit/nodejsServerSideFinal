// Orian Dabod 308337062
// Lital Kraft 314806647

// Define a function that checks if a string is empty.
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

// Export the InputValidationError and isEmpty functions.
module.exports = {
    'InputValidationError': InputValidationError,
    'isEmpty': isEmpty,
}