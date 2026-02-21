class GridRenderer {
  constructor(container) {
    this.container = container;
    this.selectedProtein = 'R';
    this.injectionAmount = 100;
    this.grid = null;
  }

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
      
      // Hue based on which channel is max (use original values to determine which is max)
      if (r === max) {
        H = (((gN - bN) / delta) % 6) * 60;
        // Wrap negative to positive
        if (H < 0) H += 360;
      } else if (g === max) {
        H = ((bN - rN) / delta + 2) * 60;
      } else if (b === max) {
        H = ((rN - gN) / delta + 4) * 60;
      }
    }
    
    // Compute final lightness
    const finalL = 1 - (1 - L) / s;
    
    // Return HSL string
    return `hsl(${Math.round(H)}, ${Math.round(S * 100)}%, ${Math.round(finalL * 100)}%)`;
  }

  enableProteinInjection(grid, proteinType = 'R', amount = 100) {
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
          
          // Re-render to show color change
          this.render(this.grid);
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
    // Clear the container
    this.container.innerHTML = '';
    
    // Create the grid element
    const gridElement = document.createElement('div');
    gridElement.className = 'grid';
    
    // Create rows and cells
    for (let y = 0; y < grid.height; y++) {
      const rowElement = document.createElement('div');
      rowElement.className = 'grid-row';
      
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.getCell(x, y);
        const cellElement = document.createElement('div');
        cellElement.className = 'grid-cell';
        cellElement.dataset.x = cell.x;
        cellElement.dataset.y = cell.y;
        
        // Apply color based on proteins
        const color = this.getCellColor(cell);
        if (color) {
          cellElement.style.backgroundColor = color;
        }
        
        rowElement.appendChild(cellElement);
      }
      
      gridElement.appendChild(rowElement);
    }
    
    this.container.appendChild(gridElement);
  }
}

module.exports = GridRenderer;
