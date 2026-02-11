import { Protein, ProteinType } from './Protein';
import { GeneticCode } from './GeneticCode';

/**
 * Represents a single cell in the grid
 */
export class Cell {
  private proteins: Map<string, Protein> = new Map();
  private geneticCode: GeneticCode;
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number, geneticCode: GeneticCode) {
    this.x = x;
    this.y = y;
    this.geneticCode = geneticCode;
  }

  /**
   * Get or create a protein in this cell
   */
  getProtein(proteinType: ProteinType): Protein {
    if (!this.proteins.has(proteinType.id)) {
      this.proteins.set(proteinType.id, new Protein(proteinType, 0));
    }
    return this.proteins.get(proteinType.id)!;
  }

  /**
   * Get all proteins in this cell
   */
  getAllProteins(): Protein[] {
    return Array.from(this.proteins.values());
  }

  /**
   * Get protein concentration map for genetic code evaluation
   */
  getProteinConcentrations(): Map<string, number> {
    const concentrations = new Map<string, number>();
    for (const [id, protein] of this.proteins) {
      concentrations.set(id, protein.concentration);
    }
    return concentrations;
  }

  /**
   * Execute one step of protein production based on genetic code
   */
  produceProteins(availableProteinTypes: Map<string, ProteinType>): void {
    const currentConcentrations = this.getProteinConcentrations();
    const production = this.geneticCode.evaluate(currentConcentrations);

    for (const [proteinId, amount] of production) {
      const proteinType = availableProteinTypes.get(proteinId);
      if (proteinType) {
        const protein = this.getProtein(proteinType);
        protein.produce(amount);
      }
    }
  }

  /**
   * Add protein from external source (propagation)
   */
  receiveProtein(proteinType: ProteinType, amount: number): void {
    const protein = this.getProtein(proteinType);
    protein.produce(amount);
  }

  /**
   * Get the genetic code for this cell
   */
  getGeneticCode(): GeneticCode {
    return this.geneticCode;
  }

  /**
   * Set a new genetic code for this cell
   */
  setGeneticCode(geneticCode: GeneticCode): void {
    this.geneticCode = geneticCode;
  }
}
