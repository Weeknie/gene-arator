const GeneticCode = require('../../src/domain/GeneticCode');

describe('GeneticCode', () => {
  test('should create empty genes map for empty string', () => {
    const geneticCode = new GeneticCode('');
    
    expect(geneticCode.genes.size).toBe(0);
  });

  test('should create empty genes map for whitespace-only string', () => {
    const geneticCode = new GeneticCode('   ');
    
    expect(geneticCode.genes.size).toBe(0);
  });

  test('should parse single gene with integer production rate', () => {
    const geneticCode = new GeneticCode('A+2');
    
    expect(geneticCode.genes.size).toBe(1);
    expect(geneticCode.genes.get('A')).toBe(2);
  });

  test('should parse single gene with float production rate', () => {
    const geneticCode = new GeneticCode('A+0.1');
    
    expect(geneticCode.genes.size).toBe(1);
    expect(geneticCode.genes.get('A')).toBe(0.1);
  });

  test('should parse multiple genes separated by semicolons', () => {
    const geneticCode = new GeneticCode('A+2;B+0.5');
    
    expect(geneticCode.genes.size).toBe(2);
    expect(geneticCode.genes.get('A')).toBe(2);
    expect(geneticCode.genes.get('B')).toBe(0.5);
  });

  test('should parse genes with whitespace around separators', () => {
    const geneticCode = new GeneticCode('A+2 ; B+0.5');
    
    expect(geneticCode.genes.size).toBe(2);
    expect(geneticCode.genes.get('A')).toBe(2);
    expect(geneticCode.genes.get('B')).toBe(0.5);
  });

  test('should throw error for invalid token with missing separator', () => {
    expect(() => {
      new GeneticCode('A+2;invalid;B+0.5');
    }).toThrow('Invalid genetic code at token 2 ("invalid"): missing "+" separator');
  });

  test('should skip empty tokens between semicolons', () => {
    const geneticCode = new GeneticCode('A+2;;B+0.5');
    
    expect(geneticCode.genes.size).toBe(2);
    expect(geneticCode.genes.get('A')).toBe(2);
    expect(geneticCode.genes.get('B')).toBe(0.5);
  });

  test('should handle multiple protein types', () => {
    const geneticCode = new GeneticCode('R+10;G+5;B+2.5');
    
    expect(geneticCode.genes.size).toBe(3);
    expect(geneticCode.genes.get('R')).toBe(10);
    expect(geneticCode.genes.get('G')).toBe(5);
    expect(geneticCode.genes.get('B')).toBe(2.5);
  });

  test('should throw error for token with empty protein name', () => {
    expect(() => {
      new GeneticCode('A+2;+5;B+0.5');
    }).toThrow('Invalid genetic code at token 2 ("+5"): empty protein name');
  });

  test('should throw error for token with non-numeric production rate', () => {
    expect(() => {
      new GeneticCode('A+2;B+abc;C+3');
    }).toThrow('Invalid genetic code at token 2 ("B+abc"): invalid production rate');
  });

  test('should throw error for token with missing production rate', () => {
    expect(() => {
      new GeneticCode('A+2;B+;C+3');
    }).toThrow('Invalid genetic code at token 2 ("B+"): invalid production rate');
  });

  test('should throw error for first token when invalid', () => {
    expect(() => {
      new GeneticCode('invalid;B+2');
    }).toThrow('Invalid genetic code at token 1 ("invalid"): missing "+" separator');
  });

  test('should throw error for last token when invalid', () => {
    expect(() => {
      new GeneticCode('A+2;B+3;invalid');
    }).toThrow('Invalid genetic code at token 3 ("invalid"): missing "+" separator');
  });
});
