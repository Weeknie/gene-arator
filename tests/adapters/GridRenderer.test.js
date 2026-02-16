/**
 * @jest-environment jsdom
 */

const GridRenderer = require('../../src/adapters/GridRenderer');
const Grid = require('../../src/domain/Grid');

describe('GridRenderer', () => {
  let container;

  beforeEach(() => {
    // Set up a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(container);
  });

  test('should render a grid to the DOM', () => {
    const grid = new Grid(10, 10);
    const renderer = new GridRenderer(container);
    
    renderer.render(grid);
    
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeTruthy();
  });

  test('should render all rows', () => {
    const grid = new Grid(10, 10);
    const renderer = new GridRenderer(container);
    
    renderer.render(grid);
    
    const rows = container.querySelectorAll('.grid-row');
    expect(rows.length).toBe(10);
  });

  test('should render all cells in each row', () => {
    const grid = new Grid(10, 10);
    const renderer = new GridRenderer(container);
    
    renderer.render(grid);
    
    const firstRow = container.querySelector('.grid-row');
    const cells = firstRow.querySelectorAll('.grid-cell');
    expect(cells.length).toBe(10);
  });

  test('should render cells with data attributes', () => {
    const grid = new Grid(10, 10);
    const renderer = new GridRenderer(container);
    
    renderer.render(grid);
    
    const cellElement = container.querySelector('.grid-cell');
    expect(cellElement.dataset.x).toBe('0');
    expect(cellElement.dataset.y).toBe('0');
  });

  test('should render total of 100 cells for 10x10 grid', () => {
    const grid = new Grid(10, 10);
    const renderer = new GridRenderer(container);
    
    renderer.render(grid);
    
    const allCells = container.querySelectorAll('.grid-cell');
    expect(allCells.length).toBe(100);
  });

  test('should apply red color to cell with R protein', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 100);
    
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
    const bgColor = centerCell.style.backgroundColor;
    
    // Should have red component
    expect(bgColor).toContain('rgb');
    expect(bgColor).toMatch(/rgb\((\d+),\s*0,\s*0\)/);
  });

  test('should apply green color to cell with G protein', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('G', 100);
    
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
    const bgColor = centerCell.style.backgroundColor;
    
    // Should have green component
    expect(bgColor).toContain('rgb');
    expect(bgColor).toMatch(/rgb\(0,\s*(\d+),\s*0\)/);
  });

  test('should apply blue color to cell with B protein', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('B', 100);
    
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
    const bgColor = centerCell.style.backgroundColor;
    
    // Should have blue component
    expect(bgColor).toContain('rgb');
    expect(bgColor).toMatch(/rgb\(0,\s*0,\s*(\d+)\)/);
  });

  test('should mix colors for cells with multiple RGB proteins', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 100);
    grid.getCell(1, 1).addProtein('G', 50);
    grid.getCell(1, 1).addProtein('B', 75);
    
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
    const bgColor = centerCell.style.backgroundColor;
    
    // Should have all three color components
    expect(bgColor).toContain('rgb');
    const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    expect(match).toBeTruthy();
    expect(parseInt(match[1])).toBeGreaterThan(0); // R
    expect(parseInt(match[2])).toBeGreaterThan(0); // G
    expect(parseInt(match[3])).toBeGreaterThan(0); // B
  });

  test('should not apply color to cells without RGB proteins', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('X', 100); // Non-RGB protein
    
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
    const bgColor = centerCell.style.backgroundColor;
    
    // Should either be empty or rgb(0, 0, 0)
    expect(bgColor === '' || bgColor === 'rgb(0, 0, 0)' || bgColor === 'rgba(0, 0, 0, 0)').toBe(true);
  });

  test('should attach click handlers to cells when enableProteinInjection is called', () => {
    const grid = new Grid(3, 3);
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    renderer.enableProteinInjection(grid, 'R', 100);
    
    const cell = container.querySelector('[data-x="1"][data-y="1"]');
    cell.click();
    
    // Cell should now have the protein
    expect(grid.getCell(1, 1).getProteinAmount('R')).toBe(100);
  });

  test('should add protein when cell is clicked', () => {
    const grid = new Grid(3, 3);
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    renderer.enableProteinInjection(grid, 'G', 50);
    
    const cell = container.querySelector('[data-x="0"][data-y="0"]');
    cell.click();
    
    expect(grid.getCell(0, 0).getProteinAmount('G')).toBe(50);
  });

  test('should update selected protein type', () => {
    const grid = new Grid(3, 3);
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    renderer.enableProteinInjection(grid, 'R', 100);
    renderer.setSelectedProtein('B');
    
    const cell = container.querySelector('[data-x="1"][data-y="1"]');
    cell.click();
    
    // Cell should have B protein, not R
    expect(grid.getCell(1, 1).getProteinAmount('B')).toBe(100);
    expect(grid.getCell(1, 1).getProteinAmount('R')).toBe(0);
  });

  test('should update injection amount', () => {
    const grid = new Grid(3, 3);
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    renderer.enableProteinInjection(grid, 'R', 100);
    renderer.setInjectionAmount(50);
    
    const cell = container.querySelector('[data-x="1"][data-y="1"]');
    cell.click();
    
    expect(grid.getCell(1, 1).getProteinAmount('R')).toBe(50);
  });
});
