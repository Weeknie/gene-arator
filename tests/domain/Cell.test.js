const Cell = require('../../src/domain/Cell');

describe('Cell', () => {
  test('should create a cell with x and y coordinates', () => {
    const cell = new Cell(0, 0);
    
    expect(cell.x).toBe(0);
    expect(cell.y).toBe(0);
  });

  test('should create a cell at different coordinates', () => {
    const cell = new Cell(5, 7);
    
    expect(cell.x).toBe(5);
    expect(cell.y).toBe(7);
  });
});
