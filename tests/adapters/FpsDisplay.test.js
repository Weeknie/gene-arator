/**
 * @jest-environment jsdom
 */
const FpsDisplay = require('../../src/adapters/FpsDisplay');

describe('FpsDisplay', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('render() creates an fps-counter element with initial text', () => {
    const display = new FpsDisplay(container);

    display.render();

    const el = container.querySelector('#fps-counter');
    expect(el).toBeTruthy();
    expect(el.textContent).toBe('FPS: 0');
  });

  test('update() changes the text content to the given fps value', () => {
    const display = new FpsDisplay(container);
    display.render();

    display.update(42);

    const el = container.querySelector('#fps-counter');
    expect(el.textContent).toBe('FPS: 42');
  });

  test('render() appends the element to the container', () => {
    const display = new FpsDisplay(container);

    display.render();

    expect(container.children.length).toBe(1);
    expect(container.children[0].id).toBe('fps-counter');
  });
});
