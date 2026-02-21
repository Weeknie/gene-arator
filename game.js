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
  
  // Initial render
  renderer.render(grid);
  renderer.enableProteinInjection(grid, 'R', 255);
  
  // Add UI controls
  createControls(renderer, grid);
  
  // Start simulation loop
  let isRunning = false;
  let intervalId = null;
  
  function startSimulation() {
    if (!isRunning) {
      isRunning = true;
      intervalId = setInterval(() => {
        grid.tick();
        renderer.render(grid);
      }, 100);
      document.getElementById('start-btn').textContent = 'Pause';
    } else {
      isRunning = false;
      clearInterval(intervalId);
      document.getElementById('start-btn').textContent = 'Start';
    }
  }
  
  document.getElementById('start-btn').addEventListener('click', startSimulation);
  
  // Create settings menu
  const settingsContainer = document.querySelector('.container');
  const settingsMenu = new SettingsMenu(settingsContainer, (newSettings) => {
    // Stop the simulation if running
    if (isRunning) {
      isRunning = false;
      clearInterval(intervalId);
      document.getElementById('start-btn').textContent = 'Start';
    }
    
    // Create new grid with new settings
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
    renderer.render(grid);
    
    // Re-enable protein injection
    renderer.enableProteinInjection(grid, renderer.selectedProtein, 255);
  });
  
  // Render settings menu with default values
  settingsMenu.render({
    gridSize: DEFAULT_GRID_SIZE,
    diffusionRate: DEFAULT_DIFFUSION_RATE,
    decayRate: DEFAULT_DECAY_RATE
  });
});