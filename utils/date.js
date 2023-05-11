// Orian Dabod 308337062
// Lital Kraft 314806647

function format2Digits(month) {
    return ("0" + month).slice(-2);
}

function currentYear() {
    const date = new Date();
    return date.getFullYear();}

function currentMonth() {
    const date = new Date();
    return date.getMonth() + 1;
}


module.exports = {
    'format2Digits': format2Digits,
    'currentYear': currentYear,
    'currentMonth': currentMonth,
}