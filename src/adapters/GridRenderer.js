export class GridRenderer {
  constructor(container) {
    this.container = container;
    this.selectedProtein = 'R';
    this.injectionAmount = 100;
    this.grid = null;
  }

  /**
   * Convert cell protein amounts to HSL color.
   * 
   * This method implements an HSL-based coloring algorithm that:
   * 1. Scales RGB protein values so max = 255
   * 2. Converts to HSL color space
   * 3. Adjusts lightness based on scaling factor
   * 4. Returns HSL string suitable for CSS
   * 
   * @param {Cell} cell - The cell to get color for
   * @returns {string} HSL color string (e.g., "hsl(0, 100%, 50%)")
   */
  getCellColor(cell) {
    // Get R, G, B protein amounts (no capping at 255)
    const r = Math.floor(cell.getProteinAmount('R'));
    const g = Math.floor(cell.getProteinAmount('G'));
    const b = Math.floor(cell.getProteinAmount('B'));
    
    // Find max
    const max = Math.max(r, g, b);
    
    // If max === 0, return white
    if (max === 0) {
      return 'hsl(0, 0%, 100%)';
    }
    
    // Compute scaling factor
    const s = 255 / max;
    
    // Scale RGB values
    const scaledR = r * s;
    const scaledG = g * s;
    const scaledB = b * s;
    
    // Convert scaled RGB [0-255] to HSL
    // Normalize
    const rN = scaledR / 255;
    const gN = scaledG / 255;
    const bN = scaledB / 255;
    
    const maxN = Math.max(rN, gN, bN);
    const minN = Math.min(rN, gN, bN);
    const delta = maxN - minN;
    
    // Lightness
    const L = (maxN + minN) / 2;
    
    let H = 0;
    let S = 0;
    
    if (delta !== 0) {
      // Saturation
      S = delta / (1 - Math.abs(2 * L - 1));
      
      // Hue based on which channel is max
      // Use scaled values to avoid floating-point precision issues
      const maxScaled = Math.max(scaledR, scaledG, scaledB);
      if (scaledR === maxScaled) {
        H = (((gN - bN) / delta) % 6) * 60;
        // Wrap negative to positive
        if (H < 0) H += 360;
      } else if (scaledG === maxScaled) {
        H = ((bN - rN) / delta + 2) * 60;
      } else if (scaledB === maxScaled) {
        H = ((rN - gN) / delta + 4) * 60;
      }
    }
    
    // Compute final lightness
    let finalL = 1 - (1 - L) / s;
    
    // Clamp finalL to valid range [0.5, 1] to handle edge cases and prevent black colors
    finalL = Math.max(0.5, Math.min(1, finalL));
    
    // Return HSL string
    return `hsl(${Math.round(H)}, ${Math.round(S * 100)}%, ${Math.round(finalL * 100)}%)`;
  }

  enableProteinInjection(grid, proteinType = 'R', amount = 255) {
    this.grid = grid;
    this.selectedProtein = proteinType;
    this.injectionAmount = amount;
    
    // Add click handler using event delegation (only once)
    if (!this.clickHandlerAttached) {
      this.container.addEventListener('click', (e) => {
        if (e.target.classList.contains('grid-cell')) {
          const x = parseInt(e.target.dataset.x);
          const y = parseInt(e.target.dataset.y);
          const cell = this.grid.getCell(x, y);
          cell.addProtein(this.selectedProtein, this.injectionAmount);
          e.target.style.backgroundColor = this.getCellColor(cell);
        }
      });
      this.clickHandlerAttached = true;
    }
  }

  setSelectedProtein(proteinType) {
    this.selectedProtein = proteinType;
  }

  setInjectionAmount(amount) {
    this.injectionAmount = amount;
  }

  render(grid) {
    const existingCells = this.container.querySelectorAll('.grid-cell');
    const expectedCount = grid.width * grid.height;

    if (existingCells.length === expectedCount) {
      // In-place update: just change colors
      let i = 0;
      for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
          existingCells[i].style.backgroundColor = this.getCellColor(grid.getCell(x, y));
          i++;
        }
      }
      return;
    }

    // Full rebuild (first render or grid size changed)
    this.container.innerHTML = '';
    const gridElement = document.createElement('div');
    gridElement.className = 'grid';
    for (let y = 0; y < grid.height; y++) {
      const rowElement = document.createElement('div');
      rowElement.className = 'grid-row';
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.getCell(x, y);
        const cellElement = document.createElement('div');
        cellElement.className = 'grid-cell';
        cellElement.dataset.x = cell.x;
        cellElement.dataset.y = cell.y;
        cellElement.style.backgroundColor = this.getCellColor(cell);
        rowElement.appendChild(cellElement);
      }
      gridElement.appendChild(rowElement);
    }
    this.container.appendChild(gridElement);
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GridRenderer;
}
