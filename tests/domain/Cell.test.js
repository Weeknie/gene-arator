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

  test('should initialize with empty proteins map', () => {
    const cell = new Cell(0, 0);
    
    expect(cell.proteins).toBeDefined();
    expect(cell.proteins.size).toBe(0);
  });

  test('should add protein to cell', () => {
    const cell = new Cell(0, 0);
    
    cell.addProtein('R', 100);
    
    expect(cell.getProteinAmount('R')).toBe(100);
  });

  test('should accumulate protein amounts when adding same protein', () => {
    const cell = new Cell(0, 0);
    
    cell.addProtein('G', 50);
    cell.addProtein('G', 30);
    
    expect(cell.getProteinAmount('G')).toBe(80);
  });

  test('should store multiple different proteins', () => {
    const cell = new Cell(0, 0);
    
    cell.addProtein('R', 100);
    cell.addProtein('G', 50);
    cell.addProtein('B', 75);
    
    expect(cell.getProteinAmount('R')).toBe(100);
    expect(cell.getProteinAmount('G')).toBe(50);
    expect(cell.getProteinAmount('B')).toBe(75);
  });

  test('should return 0 for proteins not in cell', () => {
    const cell = new Cell(0, 0);
    
    expect(cell.getProteinAmount('R')).toBe(0);
  });

  test('should decay proteins by specified percentage', () => {
    const cell = new Cell(0, 0);
    cell.addProtein('R', 100);
    
    cell.decay(0.1); // 10% decay
    
    expect(cell.getProteinAmount('R')).toBe(90);
  });

  test('should decay all proteins in cell', () => {
    const cell = new Cell(0, 0);
    cell.addProtein('R', 100);
    cell.addProtein('G', 50);
    cell.addProtein('B', 80);
    
    cell.decay(0.2); // 20% decay
    
    expect(cell.getProteinAmount('R')).toBe(80);
    expect(cell.getProteinAmount('G')).toBe(40);
    expect(cell.getProteinAmount('B')).toBe(64);
  });

  test('should not have negative protein amounts after decay', () => {
    const cell = new Cell(0, 0);
    cell.addProtein('R', 10);
    
    cell.decay(0.5);
    cell.decay(0.5);
    cell.decay(0.5);
    
    expect(cell.getProteinAmount('R')).toBeGreaterThanOrEqual(0);
  });

  test('should clear all proteins from cell', () => {
    const cell = new Cell(0, 0);
    cell.addProtein('R', 100);
    cell.addProtein('G', 50);
    cell.addProtein('B', 75);
    
    cell.clearProteins();
    
    expect(cell.getProteinAmount('R')).toBe(0);
    expect(cell.getProteinAmount('G')).toBe(0);
    expect(cell.getProteinAmount('B')).toBe(0);
    expect(cell.proteins.size).toBe(0);
  });
});
