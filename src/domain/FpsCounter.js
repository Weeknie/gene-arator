export class FpsCounter {
  constructor(windowMs = 1000) {
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  tick(now = Date.now()) {
    this.timestamps.push(now);
    this._prune(now);
  }

  getFps(now = Date.now()) {
    this._prune(now);
    return this.timestamps.length;
  }

  _prune(now) {
    const cutoff = now - this.windowMs;
    const firstValid = this.timestamps.findIndex(t => t > cutoff);
    this.timestamps = firstValid === -1 ? [] : this.timestamps.slice(firstValid);
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FpsCounter;
}
