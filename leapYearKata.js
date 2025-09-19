function checkLeapYear(year) {

    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1) {
        console.log("Error: Please provide a valid positive integer year");
        return false;
    }

    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)){
        console.log("Leap year");
    } else {
        console.log("Not leap year");
    }
}

checkLeapYear(2004);
checkLeapYear(2000);
checkLeapYear(1700);
checkLeapYear(2100);
checkLeapYear(2104);
checkLeapYear(2400);
checkLeapYear(null);
checkLeapYear("2004");
checkLeapYear(-2004);
checkLeapYear("abc");