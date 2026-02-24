/**
 * @jest-environment jsdom
 */

const { Presets } = require('../../src/adapters/Presets');

describe('Presets', () => {
  let container;
  const samplePresets = [
    { name: 'Rainbow Cycle', code: 'R+25;(R>200)->G+25' },
    { name: 'Red Spread', code: 'R+10' }
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should render a heading', () => {
    const presetsComponent = new Presets(container, samplePresets, () => {});
    presetsComponent.render();
    const heading = container.querySelector('.presets-heading');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Presets');
  });

  test('should render a list item for each preset', () => {
    const presetsComponent = new Presets(container, samplePresets, () => {});
    presetsComponent.render();
    const items = container.querySelectorAll('.presets-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe('Rainbow Cycle');
    expect(items[1].textContent).toBe('Red Spread');
  });

  test('should call onSelect with the preset code when a preset is clicked', () => {
    const onSelect = jest.fn();
    const presetsComponent = new Presets(container, samplePresets, onSelect);
    presetsComponent.render();
    const firstItem = container.querySelector('.presets-item');
    firstItem.click();
    expect(onSelect).toHaveBeenCalledWith('R+25;(R>200)->G+25');
  });

  test('should call onSelect with the correct code for each preset', () => {
    const onSelect = jest.fn();
    const presetsComponent = new Presets(container, samplePresets, onSelect);
    presetsComponent.render();
    const items = container.querySelectorAll('.presets-item');
    items[1].click();
    expect(onSelect).toHaveBeenCalledWith('R+10');
  });

  test('should render with an empty presets list without error', () => {
    const presetsComponent = new Presets(container, [], () => {});
    presetsComponent.render();
    const items = container.querySelectorAll('.presets-item');
    expect(items.length).toBe(0);
  });

  test('should set preset code as item title attribute', () => {
    const presetsComponent = new Presets(container, samplePresets, () => {});
    presetsComponent.render();
    const firstItem = container.querySelector('.presets-item');
    expect(firstItem.title).toBe('R+25;(R>200)->G+25');
  });
});
