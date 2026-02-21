class GeneticCode {
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

      // Check if this is a conditional gene (contains ->)
      if (trimmedToken.includes('->')) {
        this._parseConditionalGene(trimmedToken, tokenIndex);
      } else {
        // Parse simple gene in format "ProteinName+ProductionRate"
        const parts = trimmedToken.split('+');
        
        // Throw error if token doesn't have exactly 2 parts
        if (parts.length !== 2) {
          throw new Error(`Invalid genetic code at token ${tokenIndex} ("${trimmedToken}"): missing "+" separator`);
        }

        const proteinName = parts[0].trim();
        const productionRate = parseFloat(parts[1].trim());

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

  _parseConditionalGene(token, tokenIndex) {
    // Split by -> to get conditions and result
    const parts = token.split('->');
    
    // Last part is the result (ProteinName+ProductionRate)
    const resultPart = parts[parts.length - 1].trim();
    const resultMatch = resultPart.match(/^(\w+)\+(.+)$/);
    
    if (!resultMatch) {
      throw new Error(`Invalid genetic code at token ${tokenIndex} ("${token}"): invalid result format`);
    }
    
    const proteinName = resultMatch[1];
    const productionRate = parseFloat(resultMatch[2]);
    
    if (isNaN(productionRate)) {
      throw new Error(`Invalid genetic code at token ${tokenIndex} ("${token}"): invalid production rate`);
    }
    
    // Parse conditions (all parts except the last one)
    const conditions = [];
    for (let i = 0; i < parts.length - 1; i++) {
      const conditionPart = parts[i].trim();
      // Match (ProteinName operator threshold) - check >= and <= before > and <
      // Negative thresholds are not supported since protein amounts are always non-negative
      const conditionMatch = conditionPart.match(/^\((\w+)(>=|<=|>|<)(\d+(?:\.\d+)?)\)$/);
      
      if (!conditionMatch) {
        throw new Error(`Invalid genetic code at token ${tokenIndex} ("${token}"): invalid condition format`);
      }
      
      const threshold = parseFloat(conditionMatch[3]);
      if (isNaN(threshold)) {
        throw new Error(`Invalid genetic code at token ${tokenIndex} ("${token}"): invalid condition format`);
      }
      
      conditions.push({
        protein: conditionMatch[1],
        operator: conditionMatch[2],
        threshold: threshold
      });
    }
    
    this.conditionalGenes.push({
      conditions: conditions,
      proteinName: proteinName,
      productionRate: productionRate
    });
  }
}

module.exports = GeneticCode;
