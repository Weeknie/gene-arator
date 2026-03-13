/**
 * WasmEngine – a Grid-compatible adapter that wraps the compiled Rust/WASM
 * `WasmGrid`.  It exposes the same interface that `GridRenderer` expects
 * (`width`, `height`, and `getCell(x, y)`) so the existing renderer works
 * without modification.
 *
 * All protein data is fetched from WASM in a single boundary crossing via
 * `get_proteins_flat()` and stored in a JS-side snapshot.  Individual cell
 * objects read from this snapshot rather than calling back into WASM per cell,
 * which avoids the overhead of repeated JS↔WASM boundary crossings.
 */
export class WasmEngine {
  /**
   * @param {object} wasmGrid  - An initialised `WasmGrid` instance from the
   *   compiled Rust WASM module.  Must expose:
   *     width()  → number
   *     height() → number
   *     get_proteins_flat() → Float64Array  (row-major [r,g,b, r,g,b, …])
   *     tick(diffusionRate, decayRate) → void
   *     randomize(seed) → void
   *   **Important**: perform any initial randomization on `wasmGrid` BEFORE
   *   passing it here; the constructor fetches the initial snapshot immediately.
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
    // Fetch the initial full-grid snapshot in a single WASM call.
    this._snapshot = this._wasmGrid.get_proteins_flat();
  }

  /** Refresh the JS-side protein snapshot from WASM in one boundary crossing. */
  _refreshSnapshot() {
    this._snapshot = this._wasmGrid.get_proteins_flat();
  }

  /**
   * Return a lightweight cell-compatible object for the given coordinates.
   *
   * The object reads protein values from the JS-side snapshot, so all WASM
   * data is fetched in bulk (once per tick) rather than per-cell.  Cell
   * objects are cached so the same reference is returned for the same (x, y)
   * across multiple calls.
   *
   * @param {number} x
   * @param {number} y
   * @returns {{ x: number, y: number, proteins: Map, getProteinAmount(name): number }}
   */
  getCell(x, y) {
    const key = `${x},${y}`;
    if (!this._cellCache.has(key)) {
      const engine = this;
      const baseIdx = (y * this.width + x) * 3;
      this._cellCache.set(key, {
        x,
        y,
        /**
         * Returns a Map of current R, G, B values from the snapshot.
         * Compatible with the existing Inspector adapter which iterates
         * over `cell.proteins.entries()`.
         */
        get proteins() {
          return new Map([
            ['R', engine._snapshot[baseIdx]],
            ['G', engine._snapshot[baseIdx + 1]],
            ['B', engine._snapshot[baseIdx + 2]],
          ]);
        },
        getProteinAmount(name) {
          if (name === 'R') return engine._snapshot[baseIdx];
          if (name === 'G') return engine._snapshot[baseIdx + 1];
          if (name === 'B') return engine._snapshot[baseIdx + 2];
          return 0;
        },
      });
    }
    return this._cellCache.get(key);
  }

  /**
   * Advance the simulation by one step, applying diffusion and decay, then
   * refresh the JS-side snapshot with the new grid state in a single WASM call.
   */
  tick() {
    this._wasmGrid.tick(this.diffusionRate, this.decayRate);
    this._refreshSnapshot();
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WasmEngine };
}
