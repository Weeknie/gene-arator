const Grid = require('../../src/domain/Grid');

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
    const grid = new Grid(3, 3, 0.0); // No decay to test diffusion in isolation
    
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
    const grid = new Grid(3, 3, 0.0);
    
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
    const grid = new Grid(3, 3, 0.0);
    
    // Add protein to corner cell
    grid.getCell(0, 0).addProtein('B', 100);
    
    grid.tick();
    
    // Only two neighbors should have protein (right and bottom)
    expect(grid.getCell(1, 0).getProteinAmount('B')).toBeGreaterThan(0);
    expect(grid.getCell(0, 1).getProteinAmount('B')).toBeGreaterThan(0);
    
    // Corner cell should still have some protein
    expect(grid.getCell(0, 0).getProteinAmount('B')).toBeGreaterThan(0);
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
});
