export class FpsDisplay {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.warningElement = null;
  }

  render() {
    const div = document.createElement('div');
    div.id = 'fps-counter';
    div.textContent = 'FPS: 0';
    this.container.appendChild(div);
    this.element = div;

    const warning = document.createElement('div');
    warning.id = 'fps-warning';
    warning.textContent = 'Performance degraded: simulation paused.';
    warning.style.display = 'none';
    warning.style.color = '#b00';
    warning.style.fontWeight = 'bold';
    warning.style.marginTop = '8px';
    warning.setAttribute('role', 'alert');
    this.container.appendChild(warning);
    this.warningElement = warning;
  }

  update(fps) {
    if (this.element) {
      this.element.textContent = `FPS: ${fps}`;
    }
  }

  showWarning() {
    if (this.warningElement) {
      this.warningElement.style.display = 'block';
    }
  }

  hideWarning() {
    if (this.warningElement) {
      this.warningElement.style.display = 'none';
    }
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FpsDisplay;
}
