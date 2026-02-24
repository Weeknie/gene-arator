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
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // With R=100, scaling factor = 255/100 = 2.55
    // Scaled RGB = (255, 0, 0), HSL = (0°, 100%, 50%)
    // finalL = 1 - (1 - 0.5) / 2.55 ≈ 80%
    expect(color).toBe('hsl(0, 100%, 80%)');
  });

  test('should apply green color to cell with G protein', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('G', 100);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // With G=100, scaling factor = 255/100 = 2.55
    // Scaled RGB = (0, 255, 0), HSL = (120°, 100%, 50%)
    // finalL = 1 - (1 - 0.5) / 2.55 ≈ 80%
    expect(color).toBe('hsl(120, 100%, 80%)');
  });

  test('should apply blue color to cell with B protein', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('B', 100);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // With B=100, scaling factor = 255/100 = 2.55
    // Scaled RGB = (0, 0, 255), HSL = (240°, 100%, 50%)
    // finalL = 1 - (1 - 0.5) / 2.55 ≈ 80%
    expect(color).toBe('hsl(240, 100%, 80%)');
  });

  test('should mix colors for cells with multiple RGB proteins', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 100);
    grid.getCell(1, 1).addProtein('G', 50);
    grid.getCell(1, 1).addProtein('B', 75);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // Should have HSL format with all non-zero values
    expect(color).toContain('hsl');
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    expect(match).toBeTruthy();
    expect(parseInt(match[2])).toBeGreaterThan(0); // S (saturation)
    expect(parseInt(match[3])).toBeGreaterThan(0); // L (lightness)
  });

  test('should not apply color to cells without RGB proteins', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('X', 100); // Non-RGB protein
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // Cells with no RGB protein should now be white
    expect(color).toBe('hsl(0, 0%, 100%)');
  });

  test('should attach click handlers to cells when enableProteinInjection is called', () => {
    const grid = new Grid(3, 3);
    const renderer = new GridRenderer(container);
    renderer.render(grid);
    
    renderer.enableProteinInjection(grid, 'R', 100);
    
    const cell = container.querySelector('[data-x="1"][data-y="1"]');
    cell.click();
    
    // Injection is applied immediately on click
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

  test('should reuse existing DOM cells on re-render instead of rebuilding them', () => {
    const grid = new Grid(3, 3);
    const renderer = new GridRenderer(container);

    renderer.render(grid);
    const firstCell = container.querySelector('.grid-cell');

    renderer.render(grid);
    const firstCellAfterRerender = container.querySelector('.grid-cell');

    // Same DOM element reference — no rebuild occurred
    expect(firstCellAfterRerender).toBe(firstCell);
  });

  test('should update cell color in-place when render is called again', () => {
    const grid = new Grid(3, 3);
    const renderer = new GridRenderer(container);

    renderer.render(grid);
    const cellElement = container.querySelector('[data-x="1"][data-y="1"]');
    const colorBefore = cellElement.style.backgroundColor;

    grid.getCell(1, 1).addProtein('R', 255);
    renderer.render(grid);

    // Color should have changed in the same element
    expect(cellElement.style.backgroundColor).not.toBe(colorBefore);

    // Normalize expected color through the same DOM path jsdom uses
    const tempEl = document.createElement('div');
    tempEl.style.backgroundColor = renderer.getCellColor(grid.getCell(1, 1));
    expect(cellElement.style.backgroundColor).toBe(tempEl.style.backgroundColor);
  });

  test('should do a full rebuild when grid size changes between renders', () => {
    const smallGrid = new Grid(3, 3);
    const renderer = new GridRenderer(container);

    renderer.render(smallGrid);
    const oldCell = container.querySelector('.grid-cell');

    const largeGrid = new Grid(4, 4);
    renderer.render(largeGrid);

    // Old cell reference should no longer be in the DOM
    expect(container.contains(oldCell)).toBe(false);
  });

  // HSL algorithm specific tests
  test('should use pure HSL lightness when scaling factor is 1 (max protein = 255)', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 255);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // R=255, G=0, B=0: s=1, scaled=(255,0,0), HSL=(0°,100%,50%), finalL=50%
    expect(color).toBe('hsl(0, 100%, 50%)');
  });

  test('should increase lightness toward white with intermediate scaling', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 127);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // R=127: s ≈ 2.007, scaled=(255,0,0), HSL=(0°,100%,50%)
    // finalL = 1 - (1 - 0.5) / 2.007 ≈ 75%
    expect(color).toBe('hsl(0, 100%, 75%)');
  });

  test('should return white for cells with all zero RGB proteins', () => {
    const grid = new Grid(3, 3);
    // Cell has no RGB proteins
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // R=0, G=0, B=0 → white
    expect(color).toBe('hsl(0, 0%, 100%)');
  });

  test('should return white for cells with all equal max RGB proteins', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 255);
    grid.getCell(1, 1).addProtein('G', 255);
    grid.getCell(1, 1).addProtein('B', 255);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // R=255, G=255, B=255: s=1, scaled=(255,255,255), HSL has S=0 (gray/white)
    // Should produce white or very light gray
    expect(color).toContain('hsl');
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    expect(match).toBeTruthy();
    expect(parseInt(match[2])).toBe(0); // S = 0% (no saturation for white)
    expect(parseInt(match[3])).toBeGreaterThanOrEqual(50); // High lightness
  });

  test('should clamp lightness to minimum 50% to prevent black colors', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 300); // Exceeds 255, s < 1, finalL would drop below 0.5
    
    const renderer = new GridRenderer(container);
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // Lightness must be at least 50% to never go to black
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    expect(match).toBeTruthy();
    const lightness = parseInt(match[3]);
    expect(lightness).toBeGreaterThanOrEqual(50);
  });

  test('should handle protein values exceeding 255 without producing invalid lightness', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 300);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // Should produce valid HSL with lightness between 50-100%
    expect(color).toContain('hsl');
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    expect(match).toBeTruthy();
    const lightness = parseInt(match[3]);
    expect(lightness).toBeGreaterThanOrEqual(50);
    expect(lightness).toBeLessThanOrEqual(100);
  });

  test('should handle very large protein values gracefully', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 1000);
    
    const renderer = new GridRenderer(container);
    
    // Test the getCellColor method directly
    const color = renderer.getCellColor(grid.getCell(1, 1));
    
    // Should produce valid HSL with lightness between 50-100%
    expect(color).toContain('hsl');
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    expect(match).toBeTruthy();
    const lightness = parseInt(match[3]);
    expect(lightness).toBeGreaterThanOrEqual(50);
    expect(lightness).toBeLessThanOrEqual(100);
  });
});
