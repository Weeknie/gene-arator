/**
 * Represents a protein type with its properties
 */
export interface ProteinType {
  /** Unique identifier for the protein type */
  id: string;
  /** Human-readable name */
  name: string;
  /** How far this protein can propagate to neighboring cells */
  propagationDistance: number;
  /** Symbol used to represent this protein in visualizations */
  symbol: string;
}

/**
 * Represents a protein instance with concentration in a cell
 */
export class Protein {
  constructor(
    public readonly type: ProteinType,
    public concentration: number = 0
  ) {}

  /**
   * Increase protein concentration
   */
  produce(amount: number): void {
    this.concentration += amount;
  }

  /**
   * Decrease protein concentration (for propagation)
   */
  consume(amount: number): void {
    this.concentration = Math.max(0, this.concentration - amount);
  }

  /**
   * Check if protein can propagate based on concentration threshold
   */
  canPropagate(threshold: number = 1): boolean {
    return this.concentration >= threshold;
  }
}
