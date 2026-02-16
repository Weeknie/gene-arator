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
});
