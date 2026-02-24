const FpsCounter = require('../../src/domain/FpsCounter');

describe('FpsCounter', () => {
  test('returns 0 when no ticks have been recorded', () => {
    const counter = new FpsCounter();

    expect(counter.getFps()).toBe(0);
  });

  test('returns correct FPS count after ticks within the window', () => {
    const counter = new FpsCounter();
    const now = 1000;

    counter.tick(now - 500);
    counter.tick(now - 300);
    counter.tick(now - 100);

    expect(counter.getFps(now)).toBe(3);
  });

  test('excludes ticks older than the window (1000ms)', () => {
    const counter = new FpsCounter();
    const now = 2000;

    counter.tick(now - 1500); // older than 1000ms, should be excluded
    counter.tick(now - 800);  // within window
    counter.tick(now - 200);  // within window

    expect(counter.getFps(now)).toBe(2);
  });

  test('correctly handles the sliding window as time advances', () => {
    const counter = new FpsCounter();
    const base = 1000;

    counter.tick(base);        // 1000ms
    counter.tick(base + 100);  // 1100ms
    counter.tick(base + 200);  // 1200ms

    // At base+1150, cutoff is base+150; only tick at base+200 is still within window
    const now = base + 1150;
    expect(counter.getFps(now)).toBe(1);
  });
});
