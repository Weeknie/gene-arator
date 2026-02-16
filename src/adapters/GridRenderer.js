class GridRenderer {
  constructor(container) {
    this.container = container;
    this.selectedProtein = 'R';
    this.injectionAmount = 100;
    this.grid = null;
  }

  getCellColor(cell) {
    const rProtein = Math.min(255, Math.floor(cell.getProteinAmount('R')));
    const gProtein = Math.min(255, Math.floor(cell.getProteinAmount('G')));
    const bProtein = Math.min(255, Math.floor(cell.getProteinAmount('B')));
    
    if (rProtein === 0 && gProtein === 0 && bProtein === 0) {
      return '';
    }
    
    // Colors fade to white: each protein contributes to its channel and reduces others
    // For each channel: max of (its own protein, 255 - other proteins)
    const r = Math.min(255, Math.max(rProtein, 255 - gProtein - bProtein));
    const g = Math.min(255, Math.max(gProtein, 255 - rProtein - bProtein));
    const b = Math.min(255, Math.max(bProtein, 255 - rProtein - gProtein));
    
    return `rgb(${r}, ${g}, ${b})`;
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
