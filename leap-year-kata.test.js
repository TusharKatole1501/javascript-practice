const checkLeapYear = require('./leap-year-kata');

describe("checkLeapYear function", () => {

    test("2004 should return Leap year", () => {
        expect(checkLeapYear(2004).message).toBe("Leap year");
    });

    test("2000 should return Leap year (divisible by 400)", () => {
        expect(checkLeapYear(2000).message).toBe("Leap year");
    });

    test("1700 should return Not leap year", () => {
        expect(checkLeapYear(1700).message).toBe("Not leap year");
    });

    test("2100 should return Not leap year", () => {
        expect(checkLeapYear(2100).message).toBe("Not leap year");
    });

    test("2104 should return Leap year", () => {
        expect(checkLeapYear(2104).message).toBe("Leap year");
    });

    test("2400 should return Leap year", () => {
        expect(checkLeapYear(2400).message).toBe("Leap year");
    });

    test("null should return error", () => {
        expect(checkLeapYear(null).valid).toBe(false);
    });

    test("string '2004' should return error", () => {
        expect(checkLeapYear("2004").valid).toBe(false);
    });

    test("negative year should return error", () => {
        expect(checkLeapYear(-2004).valid).toBe(false);
    });

    test("string 'abc' should return error", () => {
        expect(checkLeapYear("abc").valid).toBe(false);
    });
});
