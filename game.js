// Cell class
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.proteins = new Map();
  }

  addProtein(proteinName, amount) {
    const currentAmount = this.proteins.get(proteinName) || 0;
    this.proteins.set(proteinName, currentAmount + amount);
  }

  getProteinAmount(proteinName) {
    return this.proteins.get(proteinName) || 0;
  }

  decay(decayRate) {
    for (const [proteinName, amount] of this.proteins.entries()) {
      const newAmount = Math.max(0, amount * (1 - decayRate));
      this.proteins.set(proteinName, newAmount);
    }
  }
}

// Grid class
class Grid {
  constructor(width, height, decayRate = 0.1, diffusionRate = 0.2) {
    this.width = width;
    this.height = height;
    this.decayRate = decayRate;
    this.diffusionRate = diffusionRate;
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

  getNeighbors(x, y) {
    const neighbors = [];
    
    // Top
    if (y > 0) neighbors.push(this.cells[y - 1][x]);
    // Bottom
    if (y < this.height - 1) neighbors.push(this.cells[y + 1][x]);
    // Left
    if (x > 0) neighbors.push(this.cells[y][x - 1]);
    // Right
    if (x < this.width - 1) neighbors.push(this.cells[y][x + 1]);
    
    return neighbors;
  }

  tick() {
    // Calculate diffusion amounts for all cells first
    const diffusionAmounts = [];
    
    for (let y = 0; y < this.height; y++) {
      diffusionAmounts[y] = [];
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        const neighbors = this.getNeighbors(x, y);
        const cellDiffusion = new Map();
        
        // For each protein in this cell
        for (const [proteinName, amount] of cell.proteins.entries()) {
          if (amount > 0 && neighbors.length > 0) {
            const amountToDiffuse = amount * this.diffusionRate;
            const amountPerNeighbor = amountToDiffuse / neighbors.length;
            
            cellDiffusion.set(proteinName, {
              outgoing: amountToDiffuse,
              perNeighbor: amountPerNeighbor,
              neighbors: neighbors
            });
          }
        }
        
        diffusionAmounts[y][x] = cellDiffusion;
      }
    }
    
    // Apply diffusion
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        const cellDiffusion = diffusionAmounts[y][x];
        
        // Remove outgoing protein
        for (const [proteinName, diffusionData] of cellDiffusion.entries()) {
          const currentAmount = cell.getProteinAmount(proteinName);
          cell.proteins.set(proteinName, currentAmount - diffusionData.outgoing);
          
          // Add to each neighbor directly
          for (const neighbor of diffusionData.neighbors) {
            neighbor.addProtein(proteinName, diffusionData.perNeighbor);
          }
        }
      }
    }
    
    // Apply decay to all cells
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x].decay(this.decayRate);
      }
    }
  }
}

// GridRenderer class
class GridRenderer {
  constructor(container) {
    this.container = container;
    this.selectedProtein = 'R';
    this.injectionAmount = 255;
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

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container');
  const grid = new Grid(20, 20);
  const renderer = new GridRenderer(container);
  
  // Initial render
  renderer.render(grid);
  renderer.enableProteinInjection(grid, 'R', 255);
  
  // Add UI controls
  createControls(renderer, grid);
  
  // Start simulation loop
  let isRunning = false;
  let intervalId = null;
  
  function startSimulation() {
    if (!isRunning) {
      isRunning = true;
      intervalId = setInterval(() => {
        grid.tick();
        renderer.render(grid);
      }, 100);
      document.getElementById('start-btn').textContent = 'Pause';
    } else {
      isRunning = false;
      clearInterval(intervalId);
      document.getElementById('start-btn').textContent = 'Start';
    }
  }
  
  document.getElementById('start-btn').addEventListener('click', startSimulation);
});

function createControls(renderer, grid) {
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'controls';
  controlsDiv.style.marginTop = '20px';
  controlsDiv.style.display = 'flex';
  controlsDiv.style.flexDirection = 'column';
  controlsDiv.style.gap = '10px';
  controlsDiv.style.alignItems = 'center';
  
  // Start/Pause button
  const startBtn = document.createElement('button');
  startBtn.id = 'start-btn';
  startBtn.textContent = 'Start';
  startBtn.style.padding = '10px 20px';
  startBtn.style.fontSize = '16px';
  startBtn.style.cursor = 'pointer';
  controlsDiv.appendChild(startBtn);
  
  // Protein selector
  const proteinDiv = document.createElement('div');
  proteinDiv.style.display = 'flex';
  proteinDiv.style.gap = '10px';
  proteinDiv.style.alignItems = 'center';
  
  const proteinLabel = document.createElement('label');
  proteinLabel.textContent = 'Protein: ';
  proteinLabel.style.fontWeight = 'bold';
  proteinDiv.appendChild(proteinLabel);
  
  ['R', 'G', 'B'].forEach(protein => {
    const btn = document.createElement('button');
    btn.textContent = protein;
    btn.style.padding = '8px 16px';
    btn.style.cursor = 'pointer';
    btn.style.border = '2px solid #333';
    btn.style.borderRadius = '4px';
    
    if (protein === 'R') {
      btn.style.backgroundColor = '#ffcccc';
      btn.style.fontWeight = 'bold';
    } else if (protein === 'G') {
      btn.style.backgroundColor = '#ccffcc';
    } else {
      btn.style.backgroundColor = '#ccccff';
    }
    
    btn.addEventListener('click', () => {
      renderer.setSelectedProtein(protein);
      // Update all buttons to show selection
      proteinDiv.querySelectorAll('button').forEach(b => {
        b.style.fontWeight = 'normal';
        b.style.border = '2px solid #333';
      });
      btn.style.fontWeight = 'bold';
      btn.style.border = '2px solid #000';
    });
    
    if (protein === 'R') {
      btn.style.border = '2px solid #000';
    }
    
    proteinDiv.appendChild(btn);
  });
  
  controlsDiv.appendChild(proteinDiv);
  
  // Amount slider
  const amountDiv = document.createElement('div');
  amountDiv.style.display = 'flex';
  amountDiv.style.gap = '10px';
  amountDiv.style.alignItems = 'center';
  
  const amountLabel = document.createElement('label');
  amountLabel.textContent = 'Amount: ';
  amountLabel.style.fontWeight = 'bold';
  amountDiv.appendChild(amountLabel);
  
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '10';
  slider.max = '255';
  slider.value = '255';
  slider.style.width = '200px';
  
  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = '255';
  valueDisplay.style.minWidth = '40px';
  valueDisplay.style.fontWeight = 'bold';
  
  slider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    renderer.setInjectionAmount(value);
    valueDisplay.textContent = value;
  });
  
  amountDiv.appendChild(slider);
  amountDiv.appendChild(valueDisplay);
  controlsDiv.appendChild(amountDiv);
  
  document.getElementById('game-container').parentElement.appendChild(controlsDiv);
}

