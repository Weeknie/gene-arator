import { Grid } from './src/domain/Grid.js';
import { GridRenderer } from './src/adapters/GridRenderer.js';
import { GeneticCode } from './src/domain/GeneticCode.js';
import { SettingsMenu } from './src/adapters/SettingsMenu.js';
import { createControls } from './src/adapters/Controls.js';
import { Presets } from './src/adapters/Presets.js';
import { Inspector } from './src/adapters/Inspector.js';
import { Legend } from './src/adapters/Legend.js';
import { presets } from './src/presets.js';
import { FpsCounter } from './src/domain/FpsCounter.js';
import { FpsDisplay } from './src/adapters/FpsDisplay.js';
import { LowFpsWatcher } from './src/domain/LowFpsWatcher.js';
import { WasmEngine } from './src/adapters/WasmEngine.js';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Default grid settings
  const DEFAULT_GRID_SIZE = 20;
  const DEFAULT_DIFFUSION_RATE = 0.2;
  const DEFAULT_DECAY_RATE = 0.1;
  const DEFAULT_GENETIC_CODE = '';
  
  const container = document.getElementById('game-container');
  let grid = new Grid(DEFAULT_GRID_SIZE, DEFAULT_GRID_SIZE, DEFAULT_DECAY_RATE, DEFAULT_DIFFUSION_RATE);
  grid.setGeneticCode(new GeneticCode(DEFAULT_GENETIC_CODE));
  const renderer = new GridRenderer(container);

  const fpsCounter = new FpsCounter();
  const lowFpsWatcher = new LowFpsWatcher();
  const appContainer = document.querySelector('.container');
  const fpsDisplay = new FpsDisplay(appContainer);
  fpsDisplay.render();

  // Engine state: 'js' uses the JavaScript Grid; 'rust' uses the WASM WasmEngine.
  let engineMode = 'js';
  let wasmEngine = null;
  let wasmModuleLoaded = false;

  /** Return the grid-compatible object for the currently active engine. */
  function activeGrid() {
    return engineMode === 'rust' && wasmEngine ? wasmEngine : grid;
  }
  
  // Initial render
  renderer.buildGrid(grid);
  renderer.enableProteinInjection(grid, 'R', 255);

  // Initialize inspector panel
  const inspectorPanel = document.getElementById('inspector-panel');
  const inspector = new Inspector(inspectorPanel);
  inspector.render();
  inspector.enableInspection(grid, container);
  
  // Add UI controls
  createControls(renderer, grid);

  // Initialize presets panel
  const presetsPanel = document.getElementById('presets-panel');
  const presetsComponent = new Presets(presetsPanel, presets, (code) => {
    const codeTextarea = document.getElementById('genetic-code-input');
    if (codeTextarea) {
      codeTextarea.value = code;
    }
    grid.clearCells();
    grid.setGeneticCode(new GeneticCode(code));
    renderer.render(grid);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('geneticCode', code);
    }
  });
  presetsComponent.render();

  // Initialize legend panel
  const legendPanel = document.getElementById('legend-panel');
  const legendComponent = new Legend(legendPanel);
  legendComponent.render();
  
  // Apply saved genetic code if present
  const savedCode = typeof localStorage !== 'undefined' ? localStorage.getItem('geneticCode') : null;
  if (savedCode) {
    try {
      grid.setGeneticCode(new GeneticCode(savedCode));
    } catch (e) {
      // Ignore invalid saved code
    }
  }
  
  // Start simulation loop
  let isRunning = false;
  let intervalId = null;

  function getSimulationInterval() {
    const speedSelect = document.getElementById('speed-select');
    const targetFps = speedSelect ? Number(speedSelect.value) : 0;
    if (targetFps === 1) return 1000;
    if (targetFps === 5) return 200;
    return 100;
  }

  function isIntentionalSlowMode() {
    const speedSelect = document.getElementById('speed-select');
    return speedSelect ? Number(speedSelect.value) > 0 : false;
  }

  function startSimulation() {
    if (!isRunning) {
      isRunning = true;
      lowFpsWatcher.reset();
      fpsDisplay.hideWarning();
      intervalId = setInterval(() => {
        const current = activeGrid();
        current.tick();
        renderer.render(current);
        inspector.tick();
        fpsCounter.tick();
        const fps = fpsCounter.getFps();
        fpsDisplay.update(fps);
        if (!isIntentionalSlowMode() && lowFpsWatcher.check(fps, Date.now(), !document.hidden)) {
          isRunning = false;
          clearInterval(intervalId);
          document.getElementById('start-btn').textContent = 'Start';
          fpsDisplay.showWarning();
        }
      }, getSimulationInterval());
      document.getElementById('start-btn').textContent = 'Pause';
    } else {
      isRunning = false;
      clearInterval(intervalId);
      document.getElementById('start-btn').textContent = 'Start';
    }
  }
  
  document.getElementById('start-btn').addEventListener('click', startSimulation);

  const speedSelectEl = document.getElementById('speed-select');
  if (speedSelectEl) {
    speedSelectEl.addEventListener('change', () => {
      if (isRunning) {
        clearInterval(intervalId);
        intervalId = null;
        isRunning = false;
        startSimulation();
      }
    });
  }

  // --- Engine toggle ---
  const engineToggleBtn = document.createElement('button');
  engineToggleBtn.id = 'engine-toggle-btn';
  engineToggleBtn.textContent = '⚙️ Switch to Rust Engine';
  engineToggleBtn.className = 'engine-toggle-btn';
  appContainer.appendChild(engineToggleBtn);

  engineToggleBtn.addEventListener('click', async () => {
    if (engineMode === 'js') {
      // Switch to Rust engine
      engineToggleBtn.textContent = '⏳ Loading Rust Engine…';
      engineToggleBtn.disabled = true;
      try {
        if (!wasmModuleLoaded) {
          // Dynamically import the WASM module (initialises the binary).
          const wasmModule = await import('./wasm-engine/pkg/gene_arator_wasm.js');
          await wasmModule.default();
          const wasmGrid = new wasmModule.WasmGrid(currentGridSize, currentGridSize);
          wasmGrid.randomize(0);
          wasmEngine = new WasmEngine(wasmGrid, grid.diffusionRate, grid.decayRate);
          wasmModuleLoaded = true;
        }
        engineMode = 'rust';
        // Update inspector to use the Rust engine's cell data.
        inspector.grid = wasmEngine;
        // Rebuild the DOM grid using the WasmEngine dimensions/data.
        renderer.buildGrid(wasmEngine);
        engineToggleBtn.textContent = '🦀 Switch to JS Engine';
      } catch (err) {
        console.error('Failed to load Rust engine:', err);
        engineToggleBtn.textContent = '⚙️ Switch to Rust Engine';
      }
      engineToggleBtn.disabled = false;
    } else {
      // Switch back to JS engine
      engineMode = 'js';
      inspector.grid = grid;
      renderer.buildGrid(grid);
      renderer.enableProteinInjection(grid, renderer.selectedProtein, 255);
      engineToggleBtn.textContent = '⚙️ Switch to Rust Engine';
    }
  });

  // Auto-start the simulation
  startSimulation();
  
  // Create settings menu
  const settingsContainer = document.querySelector('.container');
  let currentGridSize = DEFAULT_GRID_SIZE;
  const settingsMenu = new SettingsMenu(settingsContainer, (newSettings) => {
    // Apply diffusion and decay rate in-place (no stop, no clear)
    grid.diffusionRate = newSettings.diffusionRate;
    grid.decayRate = newSettings.decayRate;

    // Keep wasmEngine rates in sync if it exists
    if (wasmEngine) {
      wasmEngine.diffusionRate = newSettings.diffusionRate;
      wasmEngine.decayRate = newSettings.decayRate;
    }

    // Only recreate grid when size actually changes
    if (newSettings.gridSize !== currentGridSize && newSettings.gridSize > 0) {
      currentGridSize = newSettings.gridSize;

      grid = new Grid(
        newSettings.gridSize,
        newSettings.gridSize,
        newSettings.decayRate,
        newSettings.diffusionRate
      );

      // Set genetic code from the standalone input
      const codeTextarea = document.getElementById('genetic-code-input');
      grid.setGeneticCode(new GeneticCode(codeTextarea ? codeTextarea.value : ''));

      // Invalidate the cached wasm engine so it is recreated with the new size
      // on the next switch.
      wasmEngine = null;
      wasmModuleLoaded = false;

      // Switch back to JS mode if currently using Rust engine
      if (engineMode === 'rust') {
        engineMode = 'js';
        engineToggleBtn.textContent = '⚙️ Switch to Rust Engine';
      }

      // Re-render
      renderer.buildGrid(grid);

      // Re-enable protein injection
      renderer.enableProteinInjection(grid, renderer.selectedProtein, 255);
    }
  });

  // Render settings menu with default values
  settingsMenu.render({
    gridSize: DEFAULT_GRID_SIZE,
    diffusionRate: DEFAULT_DIFFUSION_RATE,
    decayRate: DEFAULT_DECAY_RATE
  });
});