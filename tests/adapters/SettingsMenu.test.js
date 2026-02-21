/**
 * @jest-environment jsdom
 */

const SettingsMenu = require('../../src/adapters/SettingsMenu');

describe('SettingsMenu', () => {
  let container;
  let onApply;

  beforeEach(() => {
    // Set up a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
    onApply = jest.fn();
  });

  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(container);
  });

  test('should render a settings button with class settings-btn', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const button = container.querySelector('.settings-btn');
    expect(button).toBeTruthy();
  });

  test('should render a hidden settings panel with class settings-panel', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const panel = container.querySelector('.settings-panel');
    expect(panel).toBeTruthy();
    expect(panel.hidden).toBe(true);
  });

  test('should show panel when button is clicked', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const button = container.querySelector('.settings-btn');
    const panel = container.querySelector('.settings-panel');
    
    button.click();
    
    expect(panel.hidden).toBe(false);
  });

  test('should hide panel when button is clicked again (toggle)', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const button = container.querySelector('.settings-btn');
    const panel = container.querySelector('.settings-panel');
    
    button.click();
    expect(panel.hidden).toBe(false);
    
    button.click();
    expect(panel.hidden).toBe(true);
  });

  test('should render grid size input with id settings-grid-size', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const input = container.querySelector('#settings-grid-size');
    expect(input).toBeTruthy();
    expect(input.value).toBe('20');
  });

  test('should render diffusion rate input with id settings-diffusion-rate', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const input = container.querySelector('#settings-diffusion-rate');
    expect(input).toBeTruthy();
    expect(input.value).toBe('0.2');
  });

  test('should render decay rate input with id settings-decay-rate', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const input = container.querySelector('#settings-decay-rate');
    expect(input).toBeTruthy();
    expect(input.value).toBe('0.1');
  });


  test('should call onApply with correct parsed values when apply button is clicked', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const gridSizeInput = container.querySelector('#settings-grid-size');
    const diffusionRateInput = container.querySelector('#settings-diffusion-rate');
    const decayRateInput = container.querySelector('#settings-decay-rate');
    const applyButton = container.querySelector('.settings-apply-btn');
    
    gridSizeInput.value = '30';
    diffusionRateInput.value = '0.3';
    decayRateInput.value = '0.15';
    
    applyButton.click();
    
    expect(onApply).toHaveBeenCalledWith({
      gridSize: 30,
      diffusionRate: 0.3,
      decayRate: 0.15
    });
  });

  test('should close panel after apply button is clicked', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const button = container.querySelector('.settings-btn');
    const panel = container.querySelector('.settings-panel');
    const applyButton = container.querySelector('.settings-apply-btn');
    
    button.click();
    expect(panel.hidden).toBe(false);
    
    applyButton.click();
    expect(panel.hidden).toBe(true);
  });

  test('should open panel when open method is called', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const panel = container.querySelector('.settings-panel');
    
    settingsMenu.open();
    
    expect(panel.hidden).toBe(false);
    expect(settingsMenu.isOpen).toBe(true);
  });

  test('should close panel when close method is called', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const panel = container.querySelector('.settings-panel');
    
    settingsMenu.open();
    expect(panel.hidden).toBe(false);
    
    settingsMenu.close();
    expect(panel.hidden).toBe(true);
    expect(settingsMenu.isOpen).toBe(false);
  });

  test('should toggle panel state when toggle method is called', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const panel = container.querySelector('.settings-panel');
    
    settingsMenu.toggle();
    expect(panel.hidden).toBe(false);
    
    settingsMenu.toggle();
    expect(panel.hidden).toBe(true);
  });
});
