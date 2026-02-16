const Cell = require('./Cell');

class Grid {
  constructor(width, height, decayRate = 0.1) {
    this.width = width;
    this.height = height;
    this.decayRate = decayRate;
    this.cells = [];
    
    // Initialize grid with cells
    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        this.cells[y][x] = new Cell(x, y);
      }
    }
  }

  getCell(x, y) {
    return this.cells[y][x];
  }

  tick() {
    // Apply decay to all cells
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x].decay(this.decayRate);
      }
    }
  }
}

module.exports = Grid;
