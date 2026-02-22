export class GeneticCode {
  constructor(code) {
    this.genes = new Map();
    this.conditionalGenes = [];
    this._parse(code);
  }

  _parse(code) {
    // Handle empty or whitespace-only strings
    if (!code || code.trim() === '') {
      return;
    }

    // Split by semicolon
    const tokens = code.split(';');
    let tokenIndex = 0;

    for (const token of tokens) {
      const trimmedToken = token.trim();
      
      // Skip empty tokens
      if (trimmedToken === '') {
        continue;
      }

      // Increment token index for non-empty tokens (1-based)
      tokenIndex++;

      // Check if this is a conditional token (contains "->")
      if (trimmedToken.includes('->')) {
        this._parseConditionalToken(trimmedToken, tokenIndex);
      } else {
        // Parse unconditional token in format "ProteinName+ProductionRate" or "ProteinName-ProductionRate"
        let parts = trimmedToken.split('+');
        let sign = 1;

        if (parts.length !== 2) {
          // Try negative production rate format "ProteinName-ProductionRate"
          const negativeParts = trimmedToken.split('-');
          if (negativeParts.length === 2) {
            parts = negativeParts;
            sign = -1;
          } else {
            throw new Error(`Invalid genetic code at token ${tokenIndex} ("${trimmedToken}"): missing "+" separator`);
          }
        }

        const proteinName = parts[0].trim();
        const productionRate = sign * parseFloat(parts[1].trim());

        // Throw error if protein name is empty
        if (proteinName === '') {
          throw new Error(`Invalid genetic code at token ${tokenIndex} ("${trimmedToken}"): empty protein name`);
        }

        // Throw error if production rate is invalid
        if (isNaN(productionRate)) {
          throw new Error(`Invalid genetic code at token ${tokenIndex} ("${trimmedToken}"): invalid production rate`);
        }

        this.genes.set(proteinName, productionRate);
      }
    }
  }

  _parseConditionalToken(token, tokenIndex) {
    // Split by "->" to separate conditions from production
    const parts = token.split('->');
    const MIN_CONDITIONAL_PARTS = 2;
    
    if (parts.length < MIN_CONDITIONAL_PARTS) {
      throw new Error(`Invalid genetic code at token ${tokenIndex} ("${token}"): malformed conditional expression`);
    }

    // Last part is the production (ProteinName+Rate or ProteinName-Rate)
    const productionPart = parts[parts.length - 1].trim();
    const productionPattern = /^([^+\-]+)([+\-])(\d+(?:\.\d+)?)$/;
    const productionMatch = productionPart.match(productionPattern);
    
    if (!productionMatch) {
      throw new Error(`Invalid genetic code at token ${tokenIndex} ("${token}"): invalid production format`);
    }

    const proteinName = productionMatch[1].trim();
    const sign = productionMatch[2] === '-' ? -1 : 1;
    const productionRate = sign * parseFloat(productionMatch[3]);

    // All preceding parts are conditions
    const conditions = this._parseConditions(parts.slice(0, -1), token, tokenIndex);

    this.conditionalGenes.push({
      conditions,
      proteinName,
      productionRate
    });
  }

  _parseConditions(conditionParts, token, tokenIndex) {
    const conditions = [];
    // Pattern: ( proteinName(1) operator(2) numericThreshold(3) )
    const conditionPattern = /^\(([^<>]+)([<>])(\d+(?:\.\d+)?)\)$/;
    
    for (const conditionPart of conditionParts) {
      const trimmedCondition = conditionPart.trim();
      const conditionMatch = trimmedCondition.match(conditionPattern);
      
      if (!conditionMatch) {
        throw new Error(`Invalid genetic code at token ${tokenIndex} ("${token}"): malformed condition "${trimmedCondition}"`);
      }

      conditions.push({
        protein: conditionMatch[1].trim(),
        operator: conditionMatch[2],
        threshold: parseFloat(conditionMatch[3])
      });
    }
    
    return conditions;
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeneticCode;
}
