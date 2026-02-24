export class Presets {
  /**
   * @param {HTMLElement} container - The element to render the presets list into
   * @param {Array<{name: string, code: string}>} presets - List of preset objects
   * @param {function(string): void} onSelect - Callback called with the preset code when selected
   */
  constructor(container, presets, onSelect) {
    this.container = container;
    this.presets = presets;
    this.onSelect = onSelect;
  }

  render() {
    this.container.innerHTML = '';

    const heading = document.createElement('h3');
    heading.textContent = 'Presets';
    heading.className = 'presets-heading';
    this.container.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'presets-list';

    this.presets.forEach(preset => {
      const item = document.createElement('li');
      item.className = 'presets-item';
      item.textContent = preset.name;
      item.title = preset.code;
      item.addEventListener('click', () => this.onSelect(preset.code));
      list.appendChild(item);
    });

    this.container.appendChild(list);
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Presets };
}
