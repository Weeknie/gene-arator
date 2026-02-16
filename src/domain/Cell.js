class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.proteins = new Map();
  }

  addProtein(proteinName, amount) {
    const currentAmount = this.proteins.get(proteinName) || 0;
    this.proteins.set(proteinName, currentAmount + amount);
  }

  getProteinAmount(proteinName) {
    return this.proteins.get(proteinName) || 0;
  }

  decay(decayRate) {
    for (const [proteinName, amount] of this.proteins.entries()) {
      const newAmount = Math.max(0, amount * (1 - decayRate));
      this.proteins.set(proteinName, newAmount);
    }
  }
}

module.exports = Cell;
