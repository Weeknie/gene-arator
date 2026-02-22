export class SettingsMenu {
  constructor(container, onApply) {
    this.container = container;
    this.onApply = onApply;
    this.isOpen = false;
    this.panel = null;
  }

  render(currentSettings) {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-wrapper';

    // Create settings button (cog icon)
    const button = document.createElement('button');
    button.className = 'settings-btn';
    button.textContent = '⚙';
    button.addEventListener('click', () => this.toggle());

    // Create settings panel
    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.hidden = true;
    this.panel = panel;

    // Grid size field
    const gridSizeField = this.createField(
      'Grid Size',
      'settings-grid-size',
      'number',
      currentSettings.gridSize
    );

    // Diffusion rate field
    const diffusionRateField = this.createField(
      'Diffusion Rate',
      'settings-diffusion-rate',
      'number',
      currentSettings.diffusionRate,
      0.01
    );

    // Decay rate field
    const decayRateField = this.createField(
      'Decay Rate',
      'settings-decay-rate',
      'number',
      currentSettings.decayRate,
      0.01
    );

    // Apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'settings-apply-btn';
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
      const gridSizeInput = panel.querySelector('#settings-grid-size');
      const diffusionRateInput = panel.querySelector('#settings-diffusion-rate');
      const decayRateInput = panel.querySelector('#settings-decay-rate');

      const newSettings = {
        gridSize: Number(gridSizeInput.value),
        diffusionRate: Number(diffusionRateInput.value),
        decayRate: Number(decayRateInput.value)
      };

      this.onApply(newSettings);
      this.close();
    });

    // Append fields to panel
    panel.appendChild(gridSizeField);
    panel.appendChild(diffusionRateField);
    panel.appendChild(decayRateField);
    panel.appendChild(applyButton);

    // Append button and panel to wrapper
    wrapper.appendChild(button);
    wrapper.appendChild(panel);

    // Append wrapper to container
    this.container.appendChild(wrapper);
  }

  createField(label, id, type, value, step = null) {
    const field = document.createElement('div');
    field.className = 'settings-field';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;

    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.value = value;
    if (step !== null) {
      input.step = step;
    }

    field.appendChild(labelElement);
    field.appendChild(input);

    return field;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.panel) {
      this.panel.hidden = false;
      this.isOpen = true;
    }
  }

  close() {
    if (this.panel) {
      this.panel.hidden = true;
      this.isOpen = false;
    }
  }
}
