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
    while (this.timestamps.length > 0 && this.timestamps[0] <= cutoff) {
      this.timestamps.shift();
    }
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FpsCounter;
}
