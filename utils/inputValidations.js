// Orian Dabod 308337062
// Lital Kraft 314806647

function isEmpty(str) {
    return (!str || str.length === 0);
}

class InputValidationError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = 'InputValidationError'; // (2)
    }
}

module.exports = {
    'InputValidationError': InputValidationError,
    'isEmpty': isEmpty,
}