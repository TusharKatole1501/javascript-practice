function checkLeapYear(year) {
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1) {
        return { valid: false, message: "Error: Please provide a valid positive integer year" };
    }

    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        return { valid: true, message: "Leap year" };
    } else {
        return { valid: true, message: "Not leap year" };
    }
}

module.exports = checkLeapYear;
