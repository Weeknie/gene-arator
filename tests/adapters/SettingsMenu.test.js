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


  test('should not render an apply button', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const applyButton = container.querySelector('.settings-apply-btn');
    expect(applyButton).toBeFalsy();
  });

  test('should call onApply when grid size input changes', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const gridSizeInput = container.querySelector('#settings-grid-size');
    gridSizeInput.value = '30';
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    gridSizeInput.dispatchEvent(event);
    
    expect(onApply).toHaveBeenCalledWith({
      gridSize: 30,
      diffusionRate: 0.2,
      decayRate: 0.1
    });
  });

  test('should call onApply when diffusion rate input changes', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const diffusionRateInput = container.querySelector('#settings-diffusion-rate');
    diffusionRateInput.value = '0.5';
    
    // Trigger input event
    const event = new Event('input', { bubbles: true });
    diffusionRateInput.dispatchEvent(event);
    
    expect(onApply).toHaveBeenCalledWith({
      gridSize: 20,
      diffusionRate: 0.5,
      decayRate: 0.1
    });
  });

  test('should call onApply when decay rate input changes', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const decayRateInput = container.querySelector('#settings-decay-rate');
    decayRateInput.value = '0.3';
    
    // Trigger input event
    const event = new Event('input', { bubbles: true });
    decayRateInput.dispatchEvent(event);
    
    expect(onApply).toHaveBeenCalledWith({
      gridSize: 20,
      diffusionRate: 0.2,
      decayRate: 0.3
    });
  });

  test('should render diffusion rate slider with id settings-diffusion-rate-slider', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const slider = container.querySelector('#settings-diffusion-rate-slider');
    expect(slider).toBeTruthy();
    expect(slider.type).toBe('range');
    expect(slider.value).toBe('0.2');
  });

  test('should render decay rate slider with id settings-decay-rate-slider', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const slider = container.querySelector('#settings-decay-rate-slider');
    expect(slider).toBeTruthy();
    expect(slider.type).toBe('range');
    expect(slider.value).toBe('0.1');
  });

  test('should sync slider value to number input when slider changes', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const slider = container.querySelector('#settings-diffusion-rate-slider');
    const input = container.querySelector('#settings-diffusion-rate');
    
    slider.value = '0.7';
    const event = new Event('input', { bubbles: true });
    slider.dispatchEvent(event);
    
    expect(input.value).toBe('0.7');
  });

  test('should sync number input value to slider when number input changes', () => {
    const settingsMenu = new SettingsMenu(container, onApply);
    settingsMenu.render({ gridSize: 20, diffusionRate: 0.2, decayRate: 0.1 });
    
    const slider = container.querySelector('#settings-decay-rate-slider');
    const input = container.querySelector('#settings-decay-rate');
    
    input.value = '0.8';
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    
    expect(slider.value).toBe('0.8');
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
