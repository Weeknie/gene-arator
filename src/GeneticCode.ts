import { ProteinType } from './Protein';

/**
 * Represents a rule in the genetic code
 */
export interface GeneRule {
  /** Conditions: required protein concentrations */
  conditions: Map<string, number>;
  /** Production: proteins to produce and their amounts */
  production: Map<string, number>;
}

/**
 * Represents the genetic code that determines protein production
 */
export class GeneticCode {
  private rules: GeneRule[] = [];

  constructor(rules: GeneRule[] = []) {
    this.rules = rules;
  }

  /**
   * Add a rule to the genetic code
   */
  addRule(rule: GeneRule): void {
    this.rules.push(rule);
  }

  /**
   * Evaluate genetic code against current protein concentrations
   * Returns a map of proteins to produce
   */
  evaluate(currentProteins: Map<string, number>): Map<string, number> {
    const production = new Map<string, number>();

    for (const rule of this.rules) {
      if (this.checkConditions(rule.conditions, currentProteins)) {
        // Add production from this rule
        for (const [proteinId, amount] of rule.production) {
          const current = production.get(proteinId) || 0;
          production.set(proteinId, current + amount);
        }
      }
    }

    return production;
  }

  /**
   * Check if conditions are met for a rule
   */
  private checkConditions(
    conditions: Map<string, number>,
    currentProteins: Map<string, number>
  ): boolean {
    for (const [proteinId, requiredAmount] of conditions) {
      const current = currentProteins.get(proteinId) || 0;
      if (current < requiredAmount) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get all rules
   */
  getRules(): GeneRule[] {
    return [...this.rules];
  }
}
