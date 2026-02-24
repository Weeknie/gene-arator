export class FpsDisplay {
  constructor(container) {
    this.container = container;
    this.element = null;
  }

  render() {
    const div = document.createElement('div');
    div.id = 'fps-counter';
    div.textContent = 'FPS: 0';
    this.container.appendChild(div);
    this.element = div;
  }

  update(fps) {
    if (this.element) {
      this.element.textContent = `FPS: ${fps}`;
    }
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FpsDisplay;
}
