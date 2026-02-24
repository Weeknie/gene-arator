import { Grid } from './src/domain/Grid.js';
import { GridRenderer } from './src/adapters/GridRenderer.js';
import { GeneticCode } from './src/domain/GeneticCode.js';
import { SettingsMenu } from './src/adapters/SettingsMenu.js';
import { createControls } from './src/adapters/Controls.js';
import { Presets } from './src/adapters/Presets.js';
import { presets } from './src/presets.js';
import { FpsCounter } from './src/domain/FpsCounter.js';
import { FpsDisplay } from './src/adapters/FpsDisplay.js';
import { LowFpsWatcher } from './src/domain/LowFpsWatcher.js';

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
  
  // Initial render
  renderer.buildGrid(grid);
  renderer.enableProteinInjection(grid, 'R', 255);
  
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
  
  function startSimulation() {
    if (!isRunning) {
      isRunning = true;
      lowFpsWatcher.reset();
      fpsDisplay.hideWarning();
      intervalId = setInterval(() => {
        grid.tick();
        renderer.render(grid);
        fpsCounter.tick();
        const fps = fpsCounter.getFps();
        fpsDisplay.update(fps);
        if (lowFpsWatcher.check(fps, Date.now())) {
          isRunning = false;
          clearInterval(intervalId);
          document.getElementById('start-btn').textContent = 'Start';
          fpsDisplay.showWarning();
        }
      }, 100);
      document.getElementById('start-btn').textContent = 'Pause';
    } else {
      isRunning = false;
      clearInterval(intervalId);
      document.getElementById('start-btn').textContent = 'Start';
    }
  }
  
  document.getElementById('start-btn').addEventListener('click', startSimulation);
  
  // Auto-start the simulation
  startSimulation();
  
  // Create settings menu
  const settingsContainer = document.querySelector('.container');
  let currentGridSize = DEFAULT_GRID_SIZE;
  const settingsMenu = new SettingsMenu(settingsContainer, (newSettings) => {
    // Apply diffusion and decay rate in-place (no stop, no clear)
    grid.diffusionRate = newSettings.diffusionRate;
    grid.decayRate = newSettings.decayRate;

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