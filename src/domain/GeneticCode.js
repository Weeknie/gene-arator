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
    let tokenIndex = 0;

    for (const token of tokens) {
      const trimmedToken = token.trim();
      
      // Skip empty tokens
      if (trimmedToken === '') {
        continue;
      }

      // Increment token index for non-empty tokens (1-based)
      tokenIndex++;

      // Parse token in format "ProteinName+ProductionRate"
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

module.exports = GeneticCode;
