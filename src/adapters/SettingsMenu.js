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

    // Helper: read current values and call onApply
    const applyCurrentSettings = () => {
      const gridSizeInput = panel.querySelector('#settings-grid-size');
      const diffusionRateInput = panel.querySelector('#settings-diffusion-rate');
      const decayRateInput = panel.querySelector('#settings-decay-rate');

      this.onApply({
        gridSize: Number(gridSizeInput.value),
        diffusionRate: Math.min(1, Math.max(0, Number(diffusionRateInput.value))),
        decayRate: Math.min(1, Math.max(0, Number(decayRateInput.value)))
      });
    };

    // Grid size field — apply on 'change' (when user commits the value)
    const gridSizeField = this.createField(
      'Grid Size',
      'settings-grid-size',
      'number',
      currentSettings.gridSize
    );
    gridSizeField.querySelector('#settings-grid-size').addEventListener('change', applyCurrentSettings);

    // Diffusion rate slider + number field — apply on every 'input'
    const diffusionRateField = this.createSliderField(
      'Diffusion Rate',
      'settings-diffusion-rate',
      currentSettings.diffusionRate,
      applyCurrentSettings
    );

    // Decay rate slider + number field — apply on every 'input'
    const decayRateField = this.createSliderField(
      'Decay Rate',
      'settings-decay-rate',
      currentSettings.decayRate,
      applyCurrentSettings
    );

    // Append fields to panel (no Apply button)
    panel.appendChild(gridSizeField);
    panel.appendChild(diffusionRateField);
    panel.appendChild(decayRateField);

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

  createSliderField(label, id, value, onChange) {
    const field = document.createElement('div');
    field.className = 'settings-field settings-field--slider';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;

    const controls = document.createElement('div');
    controls.className = 'settings-field-controls';

    const slider = document.createElement('input');
    slider.id = id + '-slider';
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = value;

    const input = document.createElement('input');
    input.id = id;
    input.type = 'number';
    input.min = 0;
    input.max = 1;
    input.step = 0.01;
    input.value = value;

    slider.addEventListener('input', () => {
      input.value = slider.value;
      onChange();
    });

    input.addEventListener('input', () => {
      const clamped = Math.min(1, Math.max(0, Number(input.value)));
      slider.value = clamped;
      onChange();
    });

    controls.appendChild(slider);
    controls.appendChild(input);

    field.appendChild(labelElement);
    field.appendChild(controls);

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

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsMenu;
}
