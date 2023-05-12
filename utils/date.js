// Orian Dabod 308337062
// Lital Kraft 314806647

function currentYear() {
    const date = new Date();
    return date.getFullYear();
}

function currentMonth() {
    const date = new Date();
    return date.getMonth() + 1;
}


module.exports = {
    'currentYear': currentYear,
    'currentMonth': currentMonth,
}