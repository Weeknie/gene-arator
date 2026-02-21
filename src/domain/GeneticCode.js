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

module.exports = GeneticCode;
