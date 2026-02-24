export class LowFpsWatcher {
  constructor(thresholdFps = 5, durationMs = 5000) {
    this.thresholdFps = thresholdFps;
    this.durationMs = durationMs;
    this.lowFpsSince = null;
  }

  check(fps, now = Date.now()) {
    if (fps < this.thresholdFps) {
      if (this.lowFpsSince === null) {
        this.lowFpsSince = now;
      } else if (now - this.lowFpsSince >= this.durationMs) {
        return true;
      }
    } else {
      this.lowFpsSince = null;
    }
    return false;
  }

  reset() {
    this.lowFpsSince = null;
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LowFpsWatcher;
}
