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
});
