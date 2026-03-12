/**
 * WasmEngine – a Grid-compatible adapter that wraps the compiled Rust/WASM
 * `WasmGrid`.  It exposes the same interface that `GridRenderer` expects
 * (`width`, `height`, and `getCell(x, y)`) so the existing renderer works
 * without modification.
 *
 * The adapter purposely does NOT import the WASM module directly.  The caller
 * is responsible for initialising the WASM module and passing the resulting
 * `WasmGrid` instance to the constructor.  This keeps the adapter fully
 * testable with a plain JS mock.
 */
export class WasmEngine {
  /**
   * @param {object} wasmGrid  - An initialised `WasmGrid` instance from the
   *   compiled Rust WASM module.  Must expose:
   *     width()  → number
   *     height() → number
   *     get_r(x, y) → number
   *     get_g(x, y) → number
   *     get_b(x, y) → number
   *     tick(diffusionRate, decayRate) → void
   *     randomize(seed) → void
   * @param {number} diffusionRate - Default diffusion rate used in tick().
   * @param {number} decayRate     - Default decay rate used in tick().
   */
  constructor(wasmGrid, diffusionRate = 0.2, decayRate = 0.1) {
    this._wasmGrid = wasmGrid;
    this.width = wasmGrid.width();
    this.height = wasmGrid.height();
    this.diffusionRate = diffusionRate;
    this.decayRate = decayRate;
    this._cellCache = new Map();
  }

  /**
   * Return a lightweight cell-compatible object for the given coordinates.
   * The object's `getProteinAmount` method reads live data from the WASM grid,
   * so its values are always current after a `tick()`.
   *
   * Cell objects are cached so that the same reference is returned for the
   * same (x, y) coordinates across multiple calls.
   *
   * @param {number} x
   * @param {number} y
   * @returns {{ x: number, y: number, getProteinAmount(name: string): number }}
   */
  getCell(x, y) {
    const key = `${x},${y}`;
    if (!this._cellCache.has(key)) {
      const wg = this._wasmGrid;
      this._cellCache.set(key, {
        x,
        y,
        /**
         * A getter that returns a fresh Map with the current R, G, B protein
         * amounts from the WASM grid.  This makes WasmEngine cells compatible
         * with the existing Inspector adapter which iterates over
         * `cell.proteins.entries()`.
         */
        get proteins() {
          return new Map([
            ['R', wg.get_r(x, y)],
            ['G', wg.get_g(x, y)],
            ['B', wg.get_b(x, y)],
          ]);
        },
        getProteinAmount(name) {
          if (name === 'R') return wg.get_r(x, y);
          if (name === 'G') return wg.get_g(x, y);
          if (name === 'B') return wg.get_b(x, y);
          return 0;
        },
      });
    }
    return this._cellCache.get(key);
  }

  /**
   * Advance the simulation by one step, applying diffusion and decay using
   * the rates stored on this engine instance.
   */
  tick() {
    this._wasmGrid.tick(this.diffusionRate, this.decayRate);
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WasmEngine };
}
