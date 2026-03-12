const { WasmEngine } = require('../../src/adapters/WasmEngine.js');

function makeMockWasmGrid({ width = 5, height = 3, r = 100, g = 150, b = 200 } = {}) {
  return {
    width: () => width,
    height: () => height,
    get_r: jest.fn((_x, _y) => r),
    get_g: jest.fn((_x, _y) => g),
    get_b: jest.fn((_x, _y) => b),
    tick: jest.fn(),
    randomize: jest.fn(),
  };
}

describe('WasmEngine', () => {
  let mockGrid;
  let engine;

  beforeEach(() => {
    mockGrid = makeMockWasmGrid();
    engine = new WasmEngine(mockGrid);
  });

  describe('constructor', () => {
    test('reads width and height from wasmGrid', () => {
      expect(engine.width).toBe(5);
      expect(engine.height).toBe(3);
    });

    test('stores default diffusion and decay rates', () => {
      expect(engine.diffusionRate).toBe(0.2);
      expect(engine.decayRate).toBe(0.1);
    });

    test('accepts custom diffusion and decay rates', () => {
      const custom = new WasmEngine(makeMockWasmGrid(), 0.5, 0.3);
      expect(custom.diffusionRate).toBe(0.5);
      expect(custom.decayRate).toBe(0.3);
    });
  });

  describe('getCell', () => {
    test('returns a cell with correct coordinates', () => {
      const cell = engine.getCell(2, 1);
      expect(cell.x).toBe(2);
      expect(cell.y).toBe(1);
    });

    test('cell getProteinAmount returns R from wasmGrid', () => {
      const cell = engine.getCell(2, 1);
      expect(cell.getProteinAmount('R')).toBe(100);
      expect(mockGrid.get_r).toHaveBeenCalledWith(2, 1);
    });

    test('cell getProteinAmount returns G from wasmGrid', () => {
      const cell = engine.getCell(2, 1);
      expect(cell.getProteinAmount('G')).toBe(150);
      expect(mockGrid.get_g).toHaveBeenCalledWith(2, 1);
    });

    test('cell getProteinAmount returns B from wasmGrid', () => {
      const cell = engine.getCell(2, 1);
      expect(cell.getProteinAmount('B')).toBe(200);
      expect(mockGrid.get_b).toHaveBeenCalledWith(2, 1);
    });

    test('cell getProteinAmount returns 0 for unknown protein names', () => {
      const cell = engine.getCell(0, 0);
      expect(cell.getProteinAmount('X')).toBe(0);
      expect(cell.getProteinAmount('')).toBe(0);
    });

    test('returns the same cached cell object for the same coordinates', () => {
      const cell1 = engine.getCell(2, 1);
      const cell2 = engine.getCell(2, 1);
      expect(cell1).toBe(cell2);
    });

    test('returns different cell objects for different coordinates', () => {
      const cell1 = engine.getCell(0, 0);
      const cell2 = engine.getCell(1, 0);
      expect(cell1).not.toBe(cell2);
    });

    test('cell exposes a proteins Map with R, G, B entries for Inspector compatibility', () => {
      const cell = engine.getCell(1, 2);
      const proteins = cell.proteins;
      expect(proteins).toBeInstanceOf(Map);
      expect(proteins.get('R')).toBe(100);
      expect(proteins.get('G')).toBe(150);
      expect(proteins.get('B')).toBe(200);
    });

    test('cell proteins Map reflects live wasmGrid data', () => {
      let rValue = 100;
      const dynamicGrid = {
        width: () => 2,
        height: () => 2,
        get_r: (_x, _y) => rValue,
        get_g: jest.fn(() => 0),
        get_b: jest.fn(() => 0),
        tick: jest.fn(() => { rValue = 50; }),
      };
      const dynamicEngine = new WasmEngine(dynamicGrid);
      const cell = dynamicEngine.getCell(0, 0);

      expect(cell.proteins.get('R')).toBe(100);
      dynamicEngine.tick();
      expect(cell.proteins.get('R')).toBe(50);
    });

    test('cell reads live data from wasmGrid after tick', () => {
      let rValue = 100;
      const dynamicGrid = {
        width: () => 2,
        height: () => 2,
        get_r: (_x, _y) => rValue,
        get_g: jest.fn(() => 0),
        get_b: jest.fn(() => 0),
        tick: jest.fn(() => { rValue = 50; }),
      };
      const dynamicEngine = new WasmEngine(dynamicGrid);
      const cell = dynamicEngine.getCell(0, 0);

      expect(cell.getProteinAmount('R')).toBe(100);
      dynamicEngine.tick();
      expect(cell.getProteinAmount('R')).toBe(50);
    });
  });

  describe('tick', () => {
    test('delegates to wasmGrid.tick with diffusion and decay rates', () => {
      engine.tick();
      expect(mockGrid.tick).toHaveBeenCalledWith(0.2, 0.1);
    });

    test('uses updated diffusion and decay rates when they are changed', () => {
      engine.diffusionRate = 0.4;
      engine.decayRate = 0.05;
      engine.tick();
      expect(mockGrid.tick).toHaveBeenCalledWith(0.4, 0.05);
    });
  });
});
