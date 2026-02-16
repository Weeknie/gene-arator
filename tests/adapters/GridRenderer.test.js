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
    
    // Should have red component (light red since it fades to white)
    expect(bgColor).toContain('rgb');
    // With 100 R: rgb(255, 155, 155) - red=255, green/blue=255-100=155
    expect(bgColor).toBe('rgb(255, 155, 155)');
  });

  test('should apply green color to cell with G protein', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('G', 100);
    
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
    const bgColor = centerCell.style.backgroundColor;
    
    // Should have green component (light green since it fades to white)
    expect(bgColor).toContain('rgb');
    // With 100 G: rgb(155, 255, 155) - green=255, red/blue=255-100=155
    expect(bgColor).toBe('rgb(155, 255, 155)');
  });

  test('should apply blue color to cell with B protein', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('B', 100);
    
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
    const bgColor = centerCell.style.backgroundColor;
    
    // Should have blue component (light blue since it fades to white)
    expect(bgColor).toContain('rgb');
    // With 100 B: rgb(155, 155, 255) - blue=255, red/green=255-100=155
    expect(bgColor).toBe('rgb(155, 155, 255)');
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

  // TDD: New tests for color fading to white
  describe('Color fading to white', () => {
    test('should render cell with low red protein as light red (fading to white)', () => {
      const grid = new Grid(3, 3);
      grid.getCell(1, 1).addProtein('R', 10);
      
      const renderer = new GridRenderer(container);
      renderer.render(grid);
      
      const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
      const bgColor = centerCell.style.backgroundColor;
      
      // With 10 red protein, should be light red: high R, high G, high B
      // Expected: rgb(255, 245, 245) or similar
      const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(match).toBeTruthy();
      const [_, r, g, b] = match.map(Number);
      
      expect(r).toBe(255); // Red channel should be full
      expect(g).toBeGreaterThan(200); // Green should be high (close to white)
      expect(b).toBeGreaterThan(200); // Blue should be high (close to white)
      expect(g).toBe(245); // Specifically 255 - 10 = 245
      expect(b).toBe(245); // Specifically 255 - 10 = 245
    });

    test('should render cell with high red protein as bright red', () => {
      const grid = new Grid(3, 3);
      grid.getCell(1, 1).addProtein('R', 255);
      
      const renderer = new GridRenderer(container);
      renderer.render(grid);
      
      const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
      const bgColor = centerCell.style.backgroundColor;
      
      // With 255 red protein, should be bright red: rgb(255, 0, 0)
      expect(bgColor).toBe('rgb(255, 0, 0)');
    });

    test('should render cell with equal low red and green proteins as light yellow', () => {
      const grid = new Grid(3, 3);
      grid.getCell(1, 1).addProtein('R', 50);
      grid.getCell(1, 1).addProtein('G', 50);
      
      const renderer = new GridRenderer(container);
      renderer.render(grid);
      
      const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
      const bgColor = centerCell.style.backgroundColor;
      
      // With 50 red and 50 green, should be light yellow
      // Expected: high R, high G, lower B
      const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(match).toBeTruthy();
      const [_, r, g, b] = match.map(Number);
      
      expect(r).toBeGreaterThan(200); // Red should be high
      expect(g).toBeGreaterThan(200); // Green should be high
      expect(b).toBeLessThan(200); // Blue should be lower (not white)
      expect(r).toBe(205); // 255 - 50 = 205
      expect(g).toBe(205); // 255 - 50 = 205  
      expect(b).toBe(155); // 255 - 50 - 50 = 155
    });

    test('should render cell with high equal red and green proteins as bright yellow', () => {
      const grid = new Grid(3, 3);
      grid.getCell(1, 1).addProtein('R', 255);
      grid.getCell(1, 1).addProtein('G', 255);
      
      const renderer = new GridRenderer(container);
      renderer.render(grid);
      
      const centerCell = container.querySelector('[data-x="1"][data-y="1"]');
      const bgColor = centerCell.style.backgroundColor;
      
      // With 255 red and 255 green, should be bright yellow
      // Expected: rgb(255, 255, 0) 
      // With subtractive formula: (255-255, 255-255, 255-255-255) = (0, 0, -255) → clamped to (0, 0, 0)
      // Hmm, this might not work... but let's see
      const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(match).toBeTruthy();
      const [_, r, g, b] = match.map(Number);
      
      // For bright yellow, we expect high R and G, low B
      expect(r).toBeGreaterThan(200);
      expect(g).toBeGreaterThan(200);
      expect(b).toBeLessThan(50); // Should be close to 0 for yellow
    });
  });
});
