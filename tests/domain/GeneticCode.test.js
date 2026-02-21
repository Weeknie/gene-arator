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

  test('should skip invalid tokens without crashing', () => {
    const geneticCode = new GeneticCode('A+2;invalid;B+0.5');
    
    expect(geneticCode.genes.size).toBe(2);
    expect(geneticCode.genes.get('A')).toBe(2);
    expect(geneticCode.genes.get('B')).toBe(0.5);
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

  test('should parse simple conditional expression with single condition', () => {
    const geneticCode = new GeneticCode('(A>20)->R+10');
    
    expect(geneticCode.conditionalGenes).toBeDefined();
    expect(geneticCode.conditionalGenes.length).toBe(1);
    
    const conditional = geneticCode.conditionalGenes[0];
    expect(conditional.conditions.length).toBe(1);
    expect(conditional.conditions[0].protein).toBe('A');
    expect(conditional.conditions[0].operator).toBe('>');
    expect(conditional.conditions[0].threshold).toBe(20);
    expect(conditional.proteinName).toBe('R');
    expect(conditional.productionRate).toBe(10);
  });

  test('should parse chained conditional expression with multiple conditions', () => {
    const geneticCode = new GeneticCode('(A>10)->(B>20)->R+2');
    
    expect(geneticCode.conditionalGenes).toBeDefined();
    expect(geneticCode.conditionalGenes.length).toBe(1);
    
    const conditional = geneticCode.conditionalGenes[0];
    expect(conditional.conditions.length).toBe(2);
    expect(conditional.conditions[0].protein).toBe('A');
    expect(conditional.conditions[0].operator).toBe('>');
    expect(conditional.conditions[0].threshold).toBe(10);
    expect(conditional.conditions[1].protein).toBe('B');
    expect(conditional.conditions[1].operator).toBe('>');
    expect(conditional.conditions[1].threshold).toBe(20);
    expect(conditional.proteinName).toBe('R');
    expect(conditional.productionRate).toBe(2);
  });

  test('should parse mixed code with both unconditional and conditional genes', () => {
    const geneticCode = new GeneticCode('R+5;(A>20)->G+10');
    
    // Unconditional gene
    expect(geneticCode.genes.size).toBe(1);
    expect(geneticCode.genes.get('R')).toBe(5);
    
    // Conditional gene
    expect(geneticCode.conditionalGenes.length).toBe(1);
    const conditional = geneticCode.conditionalGenes[0];
    expect(conditional.conditions.length).toBe(1);
    expect(conditional.conditions[0].protein).toBe('A');
    expect(conditional.conditions[0].operator).toBe('>');
    expect(conditional.conditions[0].threshold).toBe(20);
    expect(conditional.proteinName).toBe('G');
    expect(conditional.productionRate).toBe(10);
  });

  test('should parse conditional expressions with different operators', () => {
    const geneticCode = new GeneticCode('(A>=10)->R+1;(B<=5)->G+2;(C<20)->B+3');
    
    expect(geneticCode.conditionalGenes.length).toBe(3);
    
    // First conditional: A>=10
    expect(geneticCode.conditionalGenes[0].conditions[0].operator).toBe('>=');
    expect(geneticCode.conditionalGenes[0].conditions[0].threshold).toBe(10);
    
    // Second conditional: B<=5
    expect(geneticCode.conditionalGenes[1].conditions[0].operator).toBe('<=');
    expect(geneticCode.conditionalGenes[1].conditions[0].threshold).toBe(5);
    
    // Third conditional: C<20
    expect(geneticCode.conditionalGenes[2].conditions[0].operator).toBe('<');
    expect(geneticCode.conditionalGenes[2].conditions[0].threshold).toBe(20);
  });
});
