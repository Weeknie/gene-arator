export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.proteins = new Map();
  }

  addProtein(proteinName, amount) {
    const currentAmount = this.proteins.get(proteinName) || 0;
    this.proteins.set(proteinName, Math.max(0, currentAmount + amount));
  }

  getProteinAmount(proteinName) {
    return this.proteins.get(proteinName) || 0;
  }

  clearProteins() {
    this.proteins.clear();
  }

  decay(decayRate, proteinDecayRates = new Map()) {
    for (const [proteinName, amount] of this.proteins.entries()) {
      const rate = proteinDecayRates.has(proteinName) ? proteinDecayRates.get(proteinName) : decayRate;
      const newAmount = Math.max(0, amount * (1 - rate));
      this.proteins.set(proteinName, newAmount);
    }
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Cell;
}
