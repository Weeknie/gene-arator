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

    for (const token of tokens) {
      const trimmedToken = token.trim();
      
      // Skip empty tokens
      if (trimmedToken === '') {
        continue;
      }

      // Check if this is a conditional gene (contains ->)
      if (trimmedToken.includes('->')) {
        this._parseConditionalGene(trimmedToken);
      } else {
        // Parse simple gene in format "ProteinName+ProductionRate"
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

  _parseConditionalGene(token) {
    // Split by -> to get conditions and result
    const parts = token.split('->');
    
    // Last part is the result (ProteinName+ProductionRate)
    const resultPart = parts[parts.length - 1].trim();
    const resultMatch = resultPart.match(/^(\w+)\+(.+)$/);
    
    if (!resultMatch) {
      return; // Invalid result format
    }
    
    const proteinName = resultMatch[1];
    const productionRate = parseFloat(resultMatch[2]);
    
    if (isNaN(productionRate)) {
      return;
    }
    
    // Parse conditions (all parts except the last one)
    const conditions = [];
    for (let i = 0; i < parts.length - 1; i++) {
      const conditionPart = parts[i].trim();
      // Match (ProteinName operator threshold) - check >= and <= before > and <
      const conditionMatch = conditionPart.match(/^\((\w+)(>=|<=|>|<)(.+)\)$/);
      
      if (!conditionMatch) {
        return; // Invalid condition format
      }
      
      const threshold = parseFloat(conditionMatch[3]);
      if (isNaN(threshold)) {
        return;
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
