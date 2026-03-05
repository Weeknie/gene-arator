import * as CellModule from './Cell.js';
const Cell = CellModule.Cell || CellModule.default || CellModule;

export class Grid {
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

  clearCells() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x].clearProteins();
      }
    }
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

    // Apply conditional genes
    if (this.geneticCode && this.geneticCode.conditionalGenes.length > 0) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.cells[y][x];
          for (const { conditions, proteinName, productionRate } of this.geneticCode.conditionalGenes) {
            const allMet = conditions.every(({ protein, operator, threshold }) => {
              const amount = cell.getProteinAmount(protein);
              if (operator === '>') return amount > threshold;
              if (operator === '<') return amount < threshold;
              return false;
            });
            if (allMet) {
              cell.addProtein(proteinName, productionRate);
            }
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
          if (amount > 0) {
            const diffusionRate = (this.geneticCode && this.geneticCode.proteinDiffusionRates.has(proteinName))
              ? this.geneticCode.proteinDiffusionRates.get(proteinName)
              : this.diffusionRate;
            const amountToDiffuse = amount * diffusionRate;
            // Always divide by 4 (fully surrounded); out-of-bounds protein is discarded
            const amountPerNeighbor = amountToDiffuse / 4;
            
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
    const proteinDecayRates = this.geneticCode ? this.geneticCode.proteinDecayRates : new Map();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x].decay(this.decayRate, proteinDecayRates);
      }
    }
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Grid;
}
