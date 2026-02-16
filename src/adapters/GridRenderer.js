class GridRenderer {
  constructor(container) {
    this.container = container;
  }

  getCellColor(cell) {
    const r = Math.min(255, Math.floor(cell.getProteinAmount('R')));
    const g = Math.min(255, Math.floor(cell.getProteinAmount('G')));
    const b = Math.min(255, Math.floor(cell.getProteinAmount('B')));
    
    if (r === 0 && g === 0 && b === 0) {
      return '';
    }
    
    return `rgb(${r}, ${g}, ${b})`;
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
