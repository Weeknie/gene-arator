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

  // Conditional gene tests
  test('should parse a single conditional gene', () => {
    const geneticCode = new GeneticCode('(A>20)->R+10');
    
    expect(geneticCode.conditionalGenes).toBeDefined();
    expect(geneticCode.conditionalGenes.length).toBe(1);
    expect(geneticCode.conditionalGenes[0]).toEqual({
      conditions: [{ protein: 'A', operator: '>', threshold: 20 }],
      proteinName: 'R',
      productionRate: 10
    });
  });

  test('should parse a conditional gene with less-than operator', () => {
    const geneticCode = new GeneticCode('(B<5)->G+3');
    
    expect(geneticCode.conditionalGenes.length).toBe(1);
    expect(geneticCode.conditionalGenes[0]).toEqual({
      conditions: [{ protein: 'B', operator: '<', threshold: 5 }],
      proteinName: 'G',
      productionRate: 3
    });
  });

  test('should parse a conditional gene with chained conditions', () => {
    const geneticCode = new GeneticCode('(A>10)->(B>20)->R+2');
    
    expect(geneticCode.conditionalGenes.length).toBe(1);
    expect(geneticCode.conditionalGenes[0]).toEqual({
      conditions: [
        { protein: 'A', operator: '>', threshold: 10 },
        { protein: 'B', operator: '>', threshold: 20 }
      ],
      proteinName: 'R',
      productionRate: 2
    });
  });

  test('should throw error for malformed condition', () => {
    expect(() => {
      new GeneticCode('(A>>20)->R+10');
    }).toThrow(/Invalid genetic code/);
  });

  test('should parse mix of unconditional and conditional genes', () => {
    const geneticCode = new GeneticCode('A+5;(B>10)->C+3;D+2');
    
    expect(geneticCode.genes.size).toBe(2);
    expect(geneticCode.genes.get('A')).toBe(5);
    expect(geneticCode.genes.get('D')).toBe(2);
    
    expect(geneticCode.conditionalGenes.length).toBe(1);
    expect(geneticCode.conditionalGenes[0]).toEqual({
      conditions: [{ protein: 'B', operator: '>', threshold: 10 }],
      proteinName: 'C',
      productionRate: 3
    });
  });

  // Negative production rate tests
  test('should parse unconditional gene with negative production rate', () => {
    const geneticCode = new GeneticCode('R-2');

    expect(geneticCode.genes.size).toBe(1);
    expect(geneticCode.genes.get('R')).toBe(-2);
  });

  test('should parse unconditional gene with negative float production rate', () => {
    const geneticCode = new GeneticCode('R-0.5');

    expect(geneticCode.genes.size).toBe(1);
    expect(geneticCode.genes.get('R')).toBe(-0.5);
  });

  test('should parse conditional gene with negative production rate', () => {
    const geneticCode = new GeneticCode('(A>10)->R-5');

    expect(geneticCode.conditionalGenes.length).toBe(1);
    expect(geneticCode.conditionalGenes[0]).toEqual({
      conditions: [{ protein: 'A', operator: '>', threshold: 10 }],
      proteinName: 'R',
      productionRate: -5
    });
  });

  test('should parse mix of positive and negative unconditional genes', () => {
    const geneticCode = new GeneticCode('A+5;R-2');

    expect(geneticCode.genes.size).toBe(2);
    expect(geneticCode.genes.get('A')).toBe(5);
    expect(geneticCode.genes.get('R')).toBe(-2);
  });

  test('should parse multi-line genetic code as if whitespace', () => {
    const geneticCode = new GeneticCode('R+10;\nG+5;\nB+2');
    
    expect(geneticCode.genes.size).toBe(3);
    expect(geneticCode.genes.get('R')).toBe(10);
    expect(geneticCode.genes.get('G')).toBe(5);
    expect(geneticCode.genes.get('B')).toBe(2);
  });
});
