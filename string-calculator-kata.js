
class StringCalculator {
  add(input) {
    try {
      const result = this._internalAdd(input);
      return this._formatNumber(result);
    } catch (error) {
      return error.message;
    }
  }

  multiply(input) {
    try {
      const result = this._internalMultiply(input);
      return this._formatNumber(result);
    } catch (error) {
      return error.message;
    }
  }

  _formatNumber(num) {
    const rounded = Math.round(num * 1000000000) / 1000000000;
    return rounded.toString();
  }

  _internalAdd(input) {
    if (input === '') return 0;
    
    const parsed = this._parseInput(input);
    const numbers = this._extractNumbers(parsed.numbers, parsed.separators);
    
    return numbers.reduce((sum, num) => sum + num, 0);
  }

  _internalMultiply(input) {
    if (input === '') return 0;
    
    const parsed = this._parseInput(input);
    const numbers = this._extractNumbers(parsed.numbers, parsed.separators);
    
    if (numbers.length === 0) return 0;
    return numbers.reduce((product, num) => product * num, 1);
  }

  _parseInput(input) {
    let separators = [',', '\n'];
    let numbers = input;

    if (input.startsWith('//')) {
      const delimiterEndIndex = input.indexOf('\n');
      if (delimiterEndIndex === -1) {
        throw new Error("Invalid custom delimiter format");
      }
      
      const delimiterPart = input.substring(2, delimiterEndIndex);
      const customSeparator = delimiterPart;
      separators = [customSeparator];
      numbers = input.substring(delimiterEndIndex + 1);
    }

    return { numbers, separators };
  }

  _extractNumbers(input, separators) {
    const errors = [];
    const numbers = [];
    const negatives = [];

    if (input.includes(',\n')) {
      const pos = input.indexOf(',\n') + 1;
      errors.push(`Number expected but '\\n' found at position ${pos}.`);
      return [];
    }
    
    const tokens = this._tokenize(input, separators);
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.value === '') {
      
        if (i === tokens.length - 1) {
          errors.push("Number expected but EOF found.");
        } else {
          const expectedSeparator = separators.length === 1 ? separators[0] : ',';
          errors.push(`Number expected but '${expectedSeparator}' found at position ${token.position}.`);
        }
        continue;
      }

      if (separators.length === 1 && separators[0] !== ',' && separators[0] !== '\n') {
        const customSep = separators[0];
        if (token.value.includes(',') || token.value.includes('\n')) {
          const invalidChar = token.value.includes(',') ? ',' : '\n';
          const position = input.indexOf(invalidChar);
          errors.push(`'${customSep}' expected but '${invalidChar}' found at position ${position}.`);
          continue;
        }
      }

      const num = parseFloat(token.value);
      if (isNaN(num)) {
        continue;
      }

      if (num < 0) {
        negatives.push(num);
      }

      numbers.push(num);
    }

    
    if (negatives.length > 0) {
      const negativeMessage = `Negative not allowed : ${negatives.join(', ')}`;
      errors.unshift(negativeMessage);
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return numbers;
  }

  _tokenize(input, separators) {
    const tokens = [];
    let currentToken = '';
    let position = 0;
    let tokenStartPos = 0;

    for (let i = 0; i <= input.length; i++) {
      const char = input[i];
      
      if (i === input.length || separators.includes(char)) {
      
        tokens.push({
          value: currentToken,
          position: tokenStartPos + 1
        });
        
        currentToken = '';
        tokenStartPos = i + 1;
      } else {
        if (currentToken === '') {
          tokenStartPos = i;
        }
        currentToken += char;
      }
    }

    return tokens;
  }
}

module.exports = StringCalculator;