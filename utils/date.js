// Orian Dabod 308337062
// Lital Kraft 314806647

// Define a function that returns the current year.
function currentYear() {
    const date = new Date();
    return date.getFullYear();
}

// Define a function that returns the current month.
function currentMonth() {
    const date = new Date();
    return date.getMonth() + 1;
}

// Export the currentYear and currentMonth functions.
module.exports = {
    'currentYear': currentYear,
    'currentMonth': currentMonth,
}