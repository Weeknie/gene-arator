const LowFpsWatcher = require('../../src/domain/LowFpsWatcher');

describe('LowFpsWatcher', () => {
  test('returns false when fps is above threshold', () => {
    const watcher = new LowFpsWatcher(5, 5000);
    expect(watcher.check(10, 1000)).toBe(false);
  });

  test('returns false when fps is below threshold but duration not yet reached', () => {
    const watcher = new LowFpsWatcher(5, 5000);
    watcher.check(3, 1000);
    expect(watcher.check(3, 4000)).toBe(false);
  });

  test('returns true when fps is below threshold for exactly the duration', () => {
    const watcher = new LowFpsWatcher(5, 5000);
    watcher.check(3, 1000);
    expect(watcher.check(3, 6000)).toBe(true);
  });

  test('returns true when fps is below threshold for longer than the duration', () => {
    const watcher = new LowFpsWatcher(5, 5000);
    watcher.check(3, 1000);
    expect(watcher.check(3, 7000)).toBe(true);
  });

  test('resets the timer when fps recovers above threshold', () => {
    const watcher = new LowFpsWatcher(5, 5000);
    watcher.check(3, 1000);
    watcher.check(10, 5000); // fps recovered, timer should reset
    expect(watcher.check(3, 6000)).toBe(false); // timer restarted, not 5s yet
  });

  test('reset() clears the low fps timer', () => {
    const watcher = new LowFpsWatcher(5, 5000);
    watcher.check(3, 1000);
    watcher.reset();
    expect(watcher.check(3, 6500)).toBe(false); // timer was reset, only 0.5s elapsed
  });

  test('returns false when fps equals the threshold (not strictly below)', () => {
    const watcher = new LowFpsWatcher(5, 5000);
    watcher.check(5, 1000);
    expect(watcher.check(5, 6000)).toBe(false);
  });

  test('uses default threshold of 5 fps and duration of 5000ms', () => {
    const watcher = new LowFpsWatcher();
    watcher.check(4, 0);
    expect(watcher.check(4, 5000)).toBe(true);
  });
});
