import { Cell } from './Cell';
import { ProteinType } from './Protein';
import { GeneticCode } from './GeneticCode';

/**
 * Represents the game grid containing cells
 */
export class Grid {
  private cells: Cell[][] = [];
  private width: number;
  private height: number;
  private proteinTypes: Map<string, ProteinType> = new Map();

  constructor(width: number, height: number, defaultGeneticCode: GeneticCode) {
    this.width = width;
    this.height = height;
    this.initializeCells(defaultGeneticCode);
  }

  /**
   * Initialize all cells in the grid
   */
  private initializeCells(geneticCode: GeneticCode): void {
    for (let y = 0; y < this.height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = new Cell(x, y, geneticCode);
      }
    }
  }

  /**
   * Register a protein type that can exist in this grid
   */
  registerProteinType(proteinType: ProteinType): void {
    this.proteinTypes.set(proteinType.id, proteinType);
  }

  /**
   * Get a cell at specific coordinates
   */
  getCell(x: number, y: number): Cell | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return undefined;
    }
    return this.cells[y][x];
  }

  /**
   * Get all cells in the grid
   */
  getAllCells(): Cell[] {
    const allCells: Cell[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        allCells.push(this.cells[y][x]);
      }
    }
    return allCells;
  }

  /**
   * Get cells within a certain distance from a cell
   */
  getCellsInRange(x: number, y: number, distance: number): Cell[] {
    const cellsInRange: Cell[] = [];
    
    for (let dy = -distance; dy <= distance; dy++) {
      for (let dx = -distance; dx <= distance; dx++) {
        // Skip the center cell
        if (dx === 0 && dy === 0) continue;
        
        // Check Manhattan distance
        if (Math.abs(dx) + Math.abs(dy) <= distance) {
          const cell = this.getCell(x + dx, y + dy);
          if (cell) {
            cellsInRange.push(cell);
          }
        }
      }
    }
    
    return cellsInRange;
  }

  /**
   * Execute one simulation step: produce proteins and propagate
   */
  step(): void {
    // Step 1: Produce proteins in all cells based on genetic code
    for (const cell of this.getAllCells()) {
      cell.produceProteins(this.proteinTypes);
    }

    // Step 2: Propagate proteins to neighboring cells
    this.propagateProteins();
  }

  /**
   * Propagate proteins from all cells based on their propagation distance
   */
  private propagateProteins(): void {
    // Track propagations to apply them all at once
    const propagations: Array<{
      targetCell: Cell;
      proteinType: ProteinType;
      amount: number;
    }> = [];

    for (const cell of this.getAllCells()) {
      for (const protein of cell.getAllProteins()) {
        if (protein.canPropagate()) {
          const distance = protein.type.propagationDistance;
          const targetCells = this.getCellsInRange(cell.x, cell.y, distance);
          
          // Calculate amount to propagate (portion of concentration)
          const propagationAmount = protein.concentration * 0.1; // 10% propagates
          
          for (const targetCell of targetCells) {
            propagations.push({
              targetCell,
              proteinType: protein.type,
              amount: propagationAmount / targetCells.length
            });
          }
        }
      }
    }

    // Apply all propagations
    for (const { targetCell, proteinType, amount } of propagations) {
      targetCell.receiveProtein(proteinType, amount);
    }
  }

  /**
   * Get grid dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Get all registered protein types
   */
  getProteinTypes(): ProteinType[] {
    return Array.from(this.proteinTypes.values());
  }
}
