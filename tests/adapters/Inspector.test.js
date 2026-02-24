/**
 * @jest-environment jsdom
 */

const { Inspector } = require('../../src/adapters/Inspector');
const Grid = require('../../src/domain/Grid');

describe('Inspector', () => {
  let container;
  let gridContainer;

  beforeEach(() => {
    container = document.createElement('div');
    gridContainer = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(gridContainer);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(gridContainer);
  });

  test('should render a heading', () => {
    const inspector = new Inspector(container);
    inspector.render();
    const heading = container.querySelector('.inspector-heading');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Inspector');
  });

  test('should render an empty list on initial render', () => {
    const inspector = new Inspector(container);
    inspector.render();
    const list = container.querySelector('.inspector-list');
    expect(list).toBeTruthy();
    expect(list.children.length).toBe(0);
  });

  test('should show proteins when hovering over a cell with proteins', () => {
    const grid = new Grid(3, 3);
    grid.getCell(1, 1).addProtein('R', 100);

    const inspector = new Inspector(container);
    inspector.render();

    // Build a fake cell element with data attributes
    const cellEl = document.createElement('div');
    cellEl.className = 'grid-cell';
    cellEl.dataset.x = '1';
    cellEl.dataset.y = '1';
    gridContainer.appendChild(cellEl);

    inspector.enableInspection(grid, gridContainer);

    // Simulate mouseover on the cell
    cellEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    const items = container.querySelectorAll('.inspector-item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('R: 100');
  });

  test('should show "No proteins" when hovering over an empty cell', () => {
    const grid = new Grid(3, 3);

    const inspector = new Inspector(container);
    inspector.render();

    const cellEl = document.createElement('div');
    cellEl.className = 'grid-cell';
    cellEl.dataset.x = '0';
    cellEl.dataset.y = '0';
    gridContainer.appendChild(cellEl);

    inspector.enableInspection(grid, gridContainer);

    cellEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    const emptyEl = container.querySelector('.inspector-empty');
    expect(emptyEl).toBeTruthy();
    expect(emptyEl.textContent).toBe('No proteins');
  });

  test('should show multiple proteins when cell has several', () => {
    const grid = new Grid(3, 3);
    grid.getCell(2, 0).addProtein('R', 50);
    grid.getCell(2, 0).addProtein('G', 75);
    grid.getCell(2, 0).addProtein('B', 200);

    const inspector = new Inspector(container);
    inspector.render();

    const cellEl = document.createElement('div');
    cellEl.className = 'grid-cell';
    cellEl.dataset.x = '2';
    cellEl.dataset.y = '0';
    gridContainer.appendChild(cellEl);

    inspector.enableInspection(grid, gridContainer);

    cellEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    const items = container.querySelectorAll('.inspector-item');
    expect(items.length).toBe(3);
  });

  test('should clear the list when mouse leaves the grid container', () => {
    const grid = new Grid(3, 3);
    grid.getCell(0, 0).addProtein('R', 100);

    const inspector = new Inspector(container);
    inspector.render();

    const cellEl = document.createElement('div');
    cellEl.className = 'grid-cell';
    cellEl.dataset.x = '0';
    cellEl.dataset.y = '0';
    gridContainer.appendChild(cellEl);

    inspector.enableInspection(grid, gridContainer);

    // Hover to populate
    cellEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(container.querySelectorAll('.inspector-item').length).toBe(1);

    // Leave the container
    gridContainer.dispatchEvent(new MouseEvent('mouseleave'));
    expect(container.querySelector('.inspector-list').children.length).toBe(0);
  });

  test('should update display when hovering over a different cell', () => {
    const grid = new Grid(3, 3);
    grid.getCell(0, 0).addProtein('R', 50);
    grid.getCell(1, 1).addProtein('G', 80);

    const inspector = new Inspector(container);
    inspector.render();

    const cellA = document.createElement('div');
    cellA.className = 'grid-cell';
    cellA.dataset.x = '0';
    cellA.dataset.y = '0';

    const cellB = document.createElement('div');
    cellB.className = 'grid-cell';
    cellB.dataset.x = '1';
    cellB.dataset.y = '1';

    gridContainer.appendChild(cellA);
    gridContainer.appendChild(cellB);

    inspector.enableInspection(grid, gridContainer);

    cellA.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(container.querySelectorAll('.inspector-item')[0].textContent).toBe('R: 50');

    cellB.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(container.querySelectorAll('.inspector-item')[0].textContent).toBe('G: 80');
  });

  test('should ignore mouseover on non-cell elements', () => {
    const grid = new Grid(3, 3);

    const inspector = new Inspector(container);
    inspector.render();

    const nonCellEl = document.createElement('div');
    nonCellEl.className = 'some-other-element';
    gridContainer.appendChild(nonCellEl);

    inspector.enableInspection(grid, gridContainer);

    nonCellEl.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    const list = container.querySelector('.inspector-list');
    expect(list.children.length).toBe(0);
  });
});
