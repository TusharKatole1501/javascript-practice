// string-calculator-kata.test.js

const StringCalculator = require('./string-calculator-kata');

describe('StringCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new StringCalculator();
  });

  describe('Basic functionality', () => {
    test('empty string returns 0', () => {
      expect(calculator.add('')).toBe('0');
    });

    test('single number returns the number', () => {
      expect(calculator.add('1')).toBe('1');
      expect(calculator.add('5')).toBe('5');
    });

    test('two numbers separated by comma', () => {
      expect(calculator.add('1,2')).toBe('3');
      expect(calculator.add('1.1,2.2')).toBe('3.3');
    });
  });

  describe('Multiple numbers', () => {
    test('handles unknown number of arguments', () => {
      expect(calculator.add('1,2,3')).toBe('6');
      expect(calculator.add('1,2,3,4,5')).toBe('15');
      expect(calculator.add('0.1,0.2,0.3')).toBe('0.6');
    });
  });

  describe('Newline as separator', () => {
    test('handles newlines as separators', () => {
      expect(calculator.add('1\n2,3')).toBe('6');
      expect(calculator.add('1\n2\n3')).toBe('6');
    });

    test('invalid newline after comma', () => {
      expect(calculator.add('175.2,\n35')).toBe("Number expected but ',' found at position 6.");
    });
  });

  describe('Missing numbers', () => {
    test('input ending with separator is invalid', () => {
      expect(calculator.add('1,3,')).toBe('Number expected but EOF found.');
      expect(calculator.add('1,2,3,')).toBe('Number expected but EOF found.');
    });

    test('consecutive separators are invalid', () => {
      expect(calculator.add('1,,2')).toBe("Number expected but ',' found at position 3.");
    });
  });

  describe('Custom separators', () => {
    test('semicolon as custom separator', () => {
      expect(calculator.add('//;\n1;2')).toBe('3');
      expect(calculator.add('//;\n1;2;3')).toBe('6');
    });

    test('pipe as custom separator', () => {
      expect(calculator.add('//|\n1|2|3')).toBe('6');
    });

    test('multi-character custom separator', () => {
      expect(calculator.add('//sep\n2sep3')).toBe('5');
      expect(calculator.add('//sep\n2sep3sep1')).toBe('6');
    });

    test('wrong separator with custom delimiter', () => {
      expect(calculator.add('//|\n1|2,3')).toBe("'|' expected but ',' found at position 3.");
    });

    test('all existing scenarios work with custom separators', () => {
      expect(calculator.add('//*\n1*2*3')).toBe('6');
    });
  });

  describe('Negative numbers', () => {
    test('single negative number', () => {
      expect(calculator.add('-1,2')).toBe('Negative not allowed : -1');
    });

    test('multiple negative numbers', () => {
      expect(calculator.add('2,-4,-5')).toBe('Negative not allowed : -4, -5');
    });

    test('negative numbers with custom separator', () => {
      expect(calculator.add('//;\n-1;2;-3')).toBe('Negative not allowed : -1, -3');
    });
  });

  describe('Multiple errors', () => {
    test('negative number and missing number', () => {
      const result = calculator.add('-1,,2');
      expect(result).toBe("Negative not allowed : -1\nNumber expected but ',' found at position 4.");
    });

    test('multiple negatives and missing number', () => {
      const result = calculator.add('-1,,-2');
      expect(result).toBe("Negative not allowed : -1, -2\nNumber expected but ',' found at position 4.");
    });

    test('multiple different errors', () => {
      const result = calculator.add('-1,,-2,');
      expect(result).toContain('Negative not allowed : -1, -2');
      expect(result).toContain("Number expected but ',' found at position 4.");
      expect(result).toContain('Number expected but EOF found.');
    });
  });

  describe('Internal add function (different error handling approaches)', () => {
    test('internal add returns number', () => {
      expect(calculator._internalAdd('1,2,3')).toBe(6);
      expect(calculator._internalAdd('')).toBe(0);
    });

    test('internal add throws on invalid input', () => {
      expect(() => calculator._internalAdd('-1,2')).toThrow('Negative not allowed : -1');
      expect(() => calculator._internalAdd('1,,')).toThrow();
    });
  });

  describe('Alternative error handling approaches', () => {
    describe('Maybe/Monad approach', () => {
      test('maybe pattern implementation', () => {
        const maybeAdd = (input) => {
          try {
            const result = calculator._internalAdd(input);
            return { success: true, value: result, error: null };
          } catch (error) {
            return { success: false, value: null, error: error.message };
          }
        };

        const validResult = maybeAdd('1,2,3');
        expect(validResult.success).toBe(true);
        expect(validResult.value).toBe(6);
        expect(validResult.error).toBe(null);

        const invalidResult = maybeAdd('-1,2');
        expect(invalidResult.success).toBe(false);
        expect(invalidResult.value).toBe(null);
        expect(invalidResult.error).toBe('Negative not allowed : -1');
      });
    });

    describe('POSIX return code approach', () => {
      test('posix style return codes', () => {
        const posixAdd = (input) => {
          try {
            const result = calculator._internalAdd(input);
            return { code: 0, result: result, message: 'Success' };
          } catch (error) {
            return { code: 1, result: null, message: error.message };
          }
        };

        const validResult = posixAdd('1,2,3');
        expect(validResult.code).toBe(0);
        expect(validResult.result).toBe(6);

        const invalidResult = posixAdd('-1,2');
        expect(invalidResult.code).toBe(1);
        expect(invalidResult.result).toBe(null);
        expect(invalidResult.message).toBe('Negative not allowed : -1');
      });
    });

    describe('Go-style tuple approach', () => {
      test('tuple with error struct', () => {
        const tupleAdd = (input) => {
          try {
            const result = calculator._internalAdd(input);
            return [result, null]; 
          } catch (error) {
            return [null, { message: error.message, type: 'ValidationError' }];
          }
        };

        const [validResult, validError] = tupleAdd('1,2,3');
        expect(validResult).toBe(6);
        expect(validError).toBe(null);

        const [invalidResult, invalidError] = tupleAdd('-1,2');
        expect(invalidResult).toBe(null);
        expect(invalidError.message).toBe('Negative not allowed : -1');
        expect(invalidError.type).toBe('ValidationError');
      });
    });
  });

  describe('Multiply operation', () => {
    test('empty string returns 0', () => {
      expect(calculator.multiply('')).toBe('0');
    });

    test('single number returns the number', () => {
      expect(calculator.multiply('5')).toBe('5');
    });

    test('two numbers multiplication', () => {
      expect(calculator.multiply('2,3')).toBe('6');
      expect(calculator.multiply('1.5,2')).toBe('3');
    });

    test('multiple numbers multiplication', () => {
      expect(calculator.multiply('2,3,4')).toBe('24');
      expect(calculator.multiply('1,2,3,4,5')).toBe('120');
    });

    test('multiply with newlines', () => {
      expect(calculator.multiply('2\n3,4')).toBe('24');
    });

    test('multiply with custom separators', () => {
      expect(calculator.multiply('//;\n2;3;4')).toBe('24');
    });

    test('multiply with negative numbers error', () => {
      expect(calculator.multiply('-2,3')).toBe('Negative not allowed : -2');
    });

    test('multiply with invalid input', () => {
      expect(calculator.multiply('2,,3')).toBe("Number expected but ',' found at position 3.");
    });

    test('multiply with zero', () => {
      expect(calculator.multiply('0,5,10')).toBe('0');
    });
  });
});

describe('StringCalculator Edge Cases', () => {
  let calculator;

  beforeEach(() => {
    calculator = new StringCalculator();
  });

  test('decimal numbers', () => {
    expect(calculator.add('1.5,2.5')).toBe('4');
    expect(calculator.multiply('1.5,2')).toBe('3');
  });

  test('zero handling', () => {
    expect(calculator.add('0,5')).toBe('5');
    expect(calculator.add('0,0,0')).toBe('0');
    expect(calculator.multiply('0,5')).toBe('0');
  });

  test('large numbers', () => {
    expect(calculator.add('999,1')).toBe('1000');
    expect(calculator.multiply('100,10')).toBe('1000');
  });

  test('single character custom separators', () => {
    expect(calculator.add('//#\n1#2#3')).toBe('6');
    expect(calculator.add('//.\n1.2.3')).toBe('6');
  });
});