// GeneticCode class
class GeneticCode {
  constructor(code) {
    this.genes = new Map();
    this._parse(code);
  }

  _parse(code) {
    // Handle empty or whitespace-only strings
    if (!code || code.trim() === '') {
      return;
    }

    // Split by semicolon
    const tokens = code.split(';');

    for (const token of tokens) {
      const trimmedToken = token.trim();
      
      // Skip empty tokens
      if (trimmedToken === '') {
        continue;
      }

      // Parse token in format "ProteinName+ProductionRate"
      const parts = trimmedToken.split('+');
      
      // Skip invalid tokens (must have exactly 2 parts)
      if (parts.length !== 2) {
        continue;
      }

      const proteinName = parts[0].trim();
      const productionRate = parseFloat(parts[1].trim());

      // Skip if protein name is empty or production rate is invalid
      if (proteinName === '' || isNaN(productionRate)) {
        continue;
      }

      this.genes.set(proteinName, productionRate);
    }
  }
}

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
    this.geneticCode = null;
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

  setGeneticCode(geneticCode) {
    this.geneticCode = geneticCode;
  }

  tick() {
    // Apply genetic code production first (before diffusion)
    if (this.geneticCode && this.geneticCode.genes.size > 0) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.cells[y][x];
          for (const [proteinName, productionRate] of this.geneticCode.genes.entries()) {
            cell.addProtein(proteinName, productionRate);
          }
        }
      }
    }

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
   * Note: This method is duplicated from src/adapters/GridRenderer.js
   * for browser compatibility (game.js doesn't use module imports).
   * Any changes to GridRenderer.js must be reflected here.
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

// SettingsMenu class
class SettingsMenu {
  constructor(container, onApply) {
    this.container = container;
    this.onApply = onApply;
    this.isOpen = false;
    this.panel = null;
  }

  render(currentSettings) {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-wrapper';

    // Create settings button (cog icon)
    const button = document.createElement('button');
    button.className = 'settings-btn';
    button.textContent = '⚙';
    button.addEventListener('click', () => this.toggle());

    // Create settings panel
    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.hidden = true;
    this.panel = panel;

    // Grid size field
    const gridSizeField = this.createField(
      'Grid Size',
      'settings-grid-size',
      'number',
      currentSettings.gridSize
    );

    // Diffusion rate field
    const diffusionRateField = this.createField(
      'Diffusion Rate',
      'settings-diffusion-rate',
      'number',
      currentSettings.diffusionRate,
      0.01
    );

    // Decay rate field
    const decayRateField = this.createField(
      'Decay Rate',
      'settings-decay-rate',
      'number',
      currentSettings.decayRate,
      0.01
    );

    // Genetic code textarea
    const geneticCodeField = document.createElement('div');
    geneticCodeField.className = 'settings-field';

    const geneticCodeLabel = document.createElement('label');
    geneticCodeLabel.textContent = 'Genetic Code';
    geneticCodeLabel.htmlFor = 'settings-genetic-code';

    const geneticCodeTextarea = document.createElement('textarea');
    geneticCodeTextarea.id = 'settings-genetic-code';
    geneticCodeTextarea.rows = 4;
    geneticCodeTextarea.value = currentSettings.geneticCode || '';

    geneticCodeField.appendChild(geneticCodeLabel);
    geneticCodeField.appendChild(geneticCodeTextarea);

    // Apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'settings-apply-btn';
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
      const gridSizeInput = panel.querySelector('#settings-grid-size');
      const diffusionRateInput = panel.querySelector('#settings-diffusion-rate');
      const decayRateInput = panel.querySelector('#settings-decay-rate');
      const geneticCodeTextarea = panel.querySelector('#settings-genetic-code');

      const newSettings = {
        gridSize: Number(gridSizeInput.value),
        diffusionRate: Number(diffusionRateInput.value),
        decayRate: Number(decayRateInput.value),
        geneticCode: geneticCodeTextarea.value
      };

      this.onApply(newSettings);
      this.close();
    });

    // Append fields to panel
    panel.appendChild(gridSizeField);
    panel.appendChild(diffusionRateField);
    panel.appendChild(decayRateField);
    panel.appendChild(geneticCodeField);
    panel.appendChild(applyButton);

    // Append button and panel to wrapper
    wrapper.appendChild(button);
    wrapper.appendChild(panel);

    // Append wrapper to container
    this.container.appendChild(wrapper);
  }

  createField(label, id, type, value, step = null) {
    const field = document.createElement('div');
    field.className = 'settings-field';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;

    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.value = value;
    if (step !== null) {
      input.step = step;
    }

    field.appendChild(labelElement);
    field.appendChild(input);

    return field;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.panel) {
      this.panel.hidden = false;
      this.isOpen = true;
    }
  }

  close() {
    if (this.panel) {
      this.panel.hidden = true;
      this.isOpen = false;
    }
  }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Default grid settings
  const DEFAULT_GRID_SIZE = 20;
  const DEFAULT_DIFFUSION_RATE = 0.2;
  const DEFAULT_DECAY_RATE = 0.1;
  const DEFAULT_GENETIC_CODE = '';
  
  const container = document.getElementById('game-container');
  let grid = new Grid(DEFAULT_GRID_SIZE, DEFAULT_GRID_SIZE, DEFAULT_DECAY_RATE, DEFAULT_DIFFUSION_RATE);
  grid.setGeneticCode(new GeneticCode(DEFAULT_GENETIC_CODE));
  const renderer = new GridRenderer(container);
  
  // Initial render
  renderer.render(grid);
  renderer.enableProteinInjection(grid, 'R', 100);
  
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
  
  // Create settings menu
  const settingsContainer = document.querySelector('.container');
  const settingsMenu = new SettingsMenu(settingsContainer, (newSettings) => {
    // Stop the simulation if running
    if (isRunning) {
      isRunning = false;
      clearInterval(intervalId);
      document.getElementById('start-btn').textContent = 'Start';
    }
    
    // Create new grid with new settings
    grid = new Grid(
      newSettings.gridSize,
      newSettings.gridSize,
      newSettings.decayRate,
      newSettings.diffusionRate
    );
    
    // Set genetic code on the new grid
    grid.setGeneticCode(new GeneticCode(newSettings.geneticCode || ''));
    
    // Re-render
    renderer.render(grid);
    
    // Re-enable protein injection
    renderer.enableProteinInjection(grid, renderer.selectedProtein, renderer.injectionAmount);
  });
  
  // Render settings menu with default values
  settingsMenu.render({
    gridSize: DEFAULT_GRID_SIZE,
    diffusionRate: DEFAULT_DIFFUSION_RATE,
    decayRate: DEFAULT_DECAY_RATE,
    geneticCode: DEFAULT_GENETIC_CODE
  });
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
  slider.value = '100';
  slider.style.width = '200px';
  
  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = '100';
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

