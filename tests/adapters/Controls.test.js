/**
 * @jest-environment jsdom
 */

const createControls = require('../../src/adapters/Controls');

// Mock dependencies
jest.mock('../../src/domain/GeneticCode', () => {
  return jest.fn().mockImplementation((code) => ({ code }));
});

const Grid = require('../../src/domain/Grid');
const GridRenderer = require('../../src/adapters/GridRenderer');

describe('createControls', () => {
  let container;
  let renderer;
  let grid;
  let containerWrapper;

  beforeEach(() => {
    containerWrapper = document.createElement('div');
    containerWrapper.className = 'container';
    document.body.appendChild(containerWrapper);

    container = document.createElement('div');
    container.id = 'game-container';
    containerWrapper.appendChild(container);

    grid = new Grid(5, 5);
    renderer = new GridRenderer(container);
    renderer.buildGrid(grid);
    renderer.enableProteinInjection(grid, 'R', 100);

    localStorage.clear();
  });

  afterEach(() => {
    document.body.removeChild(containerWrapper);
    localStorage.clear();
  });

  test('should render a start button with id start-btn', () => {
    createControls(renderer, grid);
    const btn = document.getElementById('start-btn');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toBe('Start');
  });

  test('should render a clear button with id clear-btn', () => {
    createControls(renderer, grid);
    const btn = document.getElementById('clear-btn');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toBe('Clear');
  });

  test('should render genetic code textarea with id genetic-code-input', () => {
    createControls(renderer, grid);
    const textarea = document.getElementById('genetic-code-input');
    expect(textarea).toBeTruthy();
  });

  test('should load genetic code from localStorage on creation', () => {
    localStorage.setItem('geneticCode', 'R+10;G+5');
    createControls(renderer, grid);
    const textarea = document.getElementById('genetic-code-input');
    expect(textarea.value).toBe('R+10;G+5');
  });

  test('should have empty textarea when localStorage has no saved code', () => {
    createControls(renderer, grid);
    const textarea = document.getElementById('genetic-code-input');
    expect(textarea.value).toBe('');
  });

  test('should save genetic code to localStorage when Apply Code is clicked', () => {
    createControls(renderer, grid);
    const textarea = document.getElementById('genetic-code-input');
    
    // Find the apply button by text
    const allButtons = document.querySelectorAll('button');
    const applyCodeBtn = Array.from(allButtons).find(b => b.textContent === 'Apply Code');
    
    textarea.value = 'R+10';
    applyCodeBtn.click();
    
    expect(localStorage.getItem('geneticCode')).toBe('R+10');
  });

  test('should clear all cell proteins when Clear button is clicked', () => {
    // Add some protein to a cell
    grid.getCell(0, 0).addProtein('R', 100);
    expect(grid.getCell(0, 0).getProteinAmount('R')).toBe(100);

    createControls(renderer, grid);
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.click();

    expect(grid.getCell(0, 0).getProteinAmount('R')).toBe(0);
  });

  test('should render genetic code textarea with at least 8 rows', () => {
    createControls(renderer, grid);
    const textarea = document.getElementById('genetic-code-input');
    expect(parseInt(textarea.rows)).toBeGreaterThanOrEqual(8);
  });
});
