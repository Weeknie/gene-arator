const Grid = require('../../src/domain/Grid');
const GeneticCode = require('../../src/domain/GeneticCode');

describe('Grid', () => {
  test('should create a grid with specified width and height', () => {
    const grid = new Grid(10, 10);
    
    expect(grid.width).toBe(10);
    expect(grid.height).toBe(10);
  });

  test('should initialize grid with cells', () => {
    const grid = new Grid(10, 10);
    
    expect(grid.cells).toBeDefined();
    expect(grid.cells.length).toBe(10);
    expect(grid.cells[0].length).toBe(10);
  });

  test('should allow accessing cells by coordinates', () => {
    const grid = new Grid(10, 10);
    
    const cell = grid.getCell(0, 0);
    expect(cell).toBeDefined();
    expect(cell.x).toBe(0);
    expect(cell.y).toBe(0);
  });

  test('should access different cells correctly', () => {
    const grid = new Grid(10, 10);
    
    const cell = grid.getCell(5, 7);
    expect(cell.x).toBe(5);
    expect(cell.y).toBe(7);
  });

  test('should have all cells initialized', () => {
    const grid = new Grid(10, 10);
    
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = grid.getCell(x, y);
        expect(cell.x).toBe(x);
        expect(cell.y).toBe(y);
      }
    }
  });

  test('should apply decay to all cells on tick', () => {
    const grid = new Grid(3, 3, 0.1, 0); // 10% decay, no diffusion
    
    // Add proteins to some cells
    grid.getCell(0, 0).addProtein('R', 100);
    grid.getCell(1, 1).addProtein('G', 50);
    grid.getCell(2, 2).addProtein('B', 80);
    
    grid.tick();
    
    // With only decay (no diffusion), amounts should be reduced by 10%
    expect(grid.getCell(0, 0).getProteinAmount('R')).toBe(90);
    expect(grid.getCell(1, 1).getProteinAmount('G')).toBe(45);
    expect(grid.getCell(2, 2).getProteinAmount('B')).toBe(72);
  });

  test('should diffuse proteins to neighboring cells', () => {
    const grid = new Grid(3, 3, 0.0, 0.2); // No decay, 20% diffusion
    
    // Add protein to center cell
    grid.getCell(1, 1).addProtein('R', 100);
    
    grid.tick();
    
    // Center cell should have less protein after diffusion
    expect(grid.getCell(1, 1).getProteinAmount('R')).toBeLessThan(100);
    
    // Neighboring cells should have some protein
    expect(grid.getCell(0, 1).getProteinAmount('R')).toBeGreaterThan(0);
    expect(grid.getCell(2, 1).getProteinAmount('R')).toBeGreaterThan(0);
    expect(grid.getCell(1, 0).getProteinAmount('R')).toBeGreaterThan(0);
    expect(grid.getCell(1, 2).getProteinAmount('R')).toBeGreaterThan(0);
  });

  test('should distribute protein evenly to all neighbors', () => {
    const grid = new Grid(3, 3, 0.0, 0.2); // No decay, 20% diffusion
    
    // Add protein to center cell
    grid.getCell(1, 1).addProtein('G', 100);
    
    grid.tick();
    
    // All four neighbors should have equal amounts (assuming even distribution)
    const topAmount = grid.getCell(1, 0).getProteinAmount('G');
    const bottomAmount = grid.getCell(1, 2).getProteinAmount('G');
    const leftAmount = grid.getCell(0, 1).getProteinAmount('G');
    const rightAmount = grid.getCell(2, 1).getProteinAmount('G');
    
    expect(topAmount).toBeCloseTo(bottomAmount);
    expect(leftAmount).toBeCloseTo(rightAmount);
    expect(topAmount).toBeCloseTo(leftAmount);
  });

  test('should handle diffusion at grid edges', () => {
    const grid = new Grid(3, 3, 0.0, 0.2); // No decay, 20% diffusion
    
    // Add protein to corner cell
    grid.getCell(0, 0).addProtein('B', 100);
    
    grid.tick();
    
    // Only two neighbors should have protein (right and bottom)
    expect(grid.getCell(1, 0).getProteinAmount('B')).toBeGreaterThan(0);
    expect(grid.getCell(0, 1).getProteinAmount('B')).toBeGreaterThan(0);
    
    // Corner cell should still have some protein
    expect(grid.getCell(0, 0).getProteinAmount('B')).toBeGreaterThan(0);
  });

  test('should diffuse edge cells as if fully surrounded by 4 neighbors, discarding out-of-bounds protein', () => {
    const grid = new Grid(3, 3, 0.0, 0.2); // No decay, 20% diffusion
    
    // Add protein to corner cell (0,0) - has only 2 real neighbors
    grid.getCell(0, 0).addProtein('R', 100);
    
    grid.tick();
    
    // Corner cell always loses 20% (amountToDiffuse = 20)
    expect(grid.getCell(0, 0).getProteinAmount('R')).toBeCloseTo(80);
    
    // Each real neighbor gets 20/4 = 5 (not 20/2 = 10)
    expect(grid.getCell(1, 0).getProteinAmount('R')).toBeCloseTo(5);
    expect(grid.getCell(0, 1).getProteinAmount('R')).toBeCloseTo(5);
    
    // The remaining 10 (2 out-of-bounds directions) is discarded
  });

  test('should apply both decay and diffusion in same tick', () => {
    const grid = new Grid(3, 3, 0.1); // 10% decay
    
    // Add protein to center cell
    grid.getCell(1, 1).addProtein('R', 100);
    
    grid.tick();
    
    // Center cell should have lost protein to both decay and diffusion
    expect(grid.getCell(1, 1).getProteinAmount('R')).toBeLessThan(90);
    
    // Neighboring cells should have some protein from diffusion
    expect(grid.getCell(0, 1).getProteinAmount('R')).toBeGreaterThan(0);
  });

  test('should produce protein according to genetic code in every cell each tick', () => {
    const grid = new Grid(3, 3, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('R+10');
    grid.setGeneticCode(geneticCode);
    
    grid.tick();
    
    // Every cell should have 10 of R protein
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(grid.getCell(x, y).getProteinAmount('R')).toBe(10);
      }
    }
  });

  test('should produce fractional protein amounts according to genetic code', () => {
    const grid = new Grid(3, 3, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('A+0.5');
    grid.setGeneticCode(geneticCode);
    
    grid.tick();
    
    // Every cell should have 0.5 of A protein
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(grid.getCell(x, y).getProteinAmount('A')).toBe(0.5);
      }
    }
  });

  test('should accumulate protein production over multiple ticks', () => {
    const grid = new Grid(2, 2, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('B+3');
    grid.setGeneticCode(geneticCode);
    
    grid.tick();
    grid.tick();
    grid.tick();
    
    // After 3 ticks, every cell should have 9 of B protein
    expect(grid.getCell(0, 0).getProteinAmount('B')).toBe(9);
    expect(grid.getCell(1, 1).getProteinAmount('B')).toBe(9);
  });

  test('should produce multiple protein types according to genetic code', () => {
    const grid = new Grid(2, 2, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('R+5;G+3;B+1');
    grid.setGeneticCode(geneticCode);
    
    grid.tick();
    
    // Every cell should have all three proteins
    const cell = grid.getCell(0, 0);
    expect(cell.getProteinAmount('R')).toBe(5);
    expect(cell.getProteinAmount('G')).toBe(3);
    expect(cell.getProteinAmount('B')).toBe(1);
  });

  test('should apply genetic code production before diffusion', () => {
    const grid = new Grid(3, 3, 0.0, 0.5); // No decay, 50% diffusion
    const geneticCode = new GeneticCode('P+10');
    grid.setGeneticCode(geneticCode);
    
    grid.tick();
    
    // All cells should have protein (some from production, some from diffusion)
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(grid.getCell(x, y).getProteinAmount('P')).toBeGreaterThan(0);
      }
    }
  });

  // Conditional gene tests
  test('should not apply conditional gene when condition is not met', () => {
    const grid = new Grid(2, 2, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('(A>20)->R+10');
    grid.setGeneticCode(geneticCode);
    
    // Add only 10 of protein A to one cell
    grid.getCell(0, 0).addProtein('A', 10);
    
    grid.tick();
    
    // R should not be produced because A is not > 20
    expect(grid.getCell(0, 0).getProteinAmount('R')).toBe(0);
  });

  test('should apply conditional gene when condition is met', () => {
    const grid = new Grid(2, 2, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('(A>20)->R+10');
    grid.setGeneticCode(geneticCode);
    
    // Add 25 of protein A to one cell
    grid.getCell(0, 0).addProtein('A', 25);
    
    grid.tick();
    
    // R should be produced because A > 20
    expect(grid.getCell(0, 0).getProteinAmount('R')).toBe(10);
    
    // Cell without enough A should not produce R
    expect(grid.getCell(1, 1).getProteinAmount('R')).toBe(0);
  });

  test('should apply chained conditional gene only when all conditions are met', () => {
    const grid = new Grid(2, 2, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('(A>10)->(B>20)->R+2');
    grid.setGeneticCode(geneticCode);
    
    const cell = grid.getCell(0, 0);
    
    // Case 1: Only first condition met
    cell.addProtein('A', 15);
    grid.tick();
    expect(cell.getProteinAmount('R')).toBe(0);
    
    // Case 2: Only second condition met
    cell.clearProteins();
    cell.addProtein('B', 25);
    grid.tick();
    expect(cell.getProteinAmount('R')).toBe(0);
    
    // Case 3: Both conditions met
    cell.clearProteins();
    cell.addProtein('A', 15);
    cell.addProtein('B', 25);
    grid.tick();
    expect(cell.getProteinAmount('R')).toBe(2);
  });

  test('should apply conditional gene when condition references a protein produced by unconditional gene in same tick', () => {
    const grid = new Grid(2, 2, 0.0, 0.0); // No decay, no diffusion
    const geneticCode = new GeneticCode('A+25;(A>20)->R+10');
    grid.setGeneticCode(geneticCode);
    
    grid.tick();
    
    // A should be produced first (25), then condition should be checked (25 > 20 is true)
    // So R should also be produced
    expect(grid.getCell(0, 0).getProteinAmount('A')).toBe(25);
    expect(grid.getCell(0, 0).getProteinAmount('R')).toBe(10);
  });

  // Per-protein property tests
  test('should use per-protein diffusion rate from genetic code', () => {
    const grid = new Grid(3, 3, 0.0, 0.2); // No decay, global 20% diffusion
    const geneticCode = new GeneticCode('R=diff(0.0)'); // R has 0% diffusion
    grid.setGeneticCode(geneticCode);

    grid.getCell(1, 1).addProtein('R', 100);

    grid.tick();

    // R should not diffuse because per-protein rate is 0
    expect(grid.getCell(1, 1).getProteinAmount('R')).toBeCloseTo(100);
    expect(grid.getCell(0, 1).getProteinAmount('R')).toBeCloseTo(0);
  });

  test('should use per-protein decay rate from genetic code', () => {
    const grid = new Grid(3, 3, 0.1, 0.0); // 10% global decay, no diffusion
    const geneticCode = new GeneticCode('R=decay(0.5)'); // R has 50% decay
    grid.setGeneticCode(geneticCode);

    grid.getCell(0, 0).addProtein('R', 100);
    grid.getCell(0, 0).addProtein('G', 100);

    grid.tick();

    // R should use 50% decay, G should use global 10% decay
    expect(grid.getCell(0, 0).getProteinAmount('R')).toBeCloseTo(50);
    expect(grid.getCell(0, 0).getProteinAmount('G')).toBeCloseTo(90);
  });

  test('should apply per-protein diff and decay independently for different proteins', () => {
    const grid = new Grid(1, 1, 0.0, 0.0); // No global decay or diffusion
    const geneticCode = new GeneticCode('A=decay(0.2);B=decay(0.5)');
    grid.setGeneticCode(geneticCode);

    grid.getCell(0, 0).addProtein('A', 100);
    grid.getCell(0, 0).addProtein('B', 100);

    grid.tick();

    expect(grid.getCell(0, 0).getProteinAmount('A')).toBeCloseTo(80);
    expect(grid.getCell(0, 0).getProteinAmount('B')).toBeCloseTo(50);
  });
});
