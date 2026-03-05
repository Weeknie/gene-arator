import * as GeneticCodeModule from '../domain/GeneticCode.js';
const GeneticCode = GeneticCodeModule.GeneticCode || GeneticCodeModule.default || GeneticCodeModule;

const BTN_STYLE = {
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
  border: '1px solid #333',
  borderRadius: '4px',
  backgroundColor: '#f5f5f5',
};

function applyBtnStyle(btn) {
  Object.assign(btn.style, BTN_STYLE);
}

export function createControls(renderer, grid) {
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'controls';
  controlsDiv.style.marginTop = '20px';
  controlsDiv.style.display = 'flex';
  controlsDiv.style.flexDirection = 'column';
  controlsDiv.style.gap = '10px';
  controlsDiv.style.width = '100%';

  // --- Buttons row: [Apply Code] | divider | [Start/Pause] [Clear] ---
  const buttonsRow = document.createElement('div');
  buttonsRow.style.display = 'flex';
  buttonsRow.style.alignItems = 'center';
  buttonsRow.style.gap = '8px';
  buttonsRow.style.justifyContent = 'center';

  // Apply Code button (left side)
  const applyCodeBtn = document.createElement('button');
  applyCodeBtn.textContent = 'Apply Code';
  applyBtnStyle(applyCodeBtn);

  buttonsRow.appendChild(applyCodeBtn);

  // Visual divider
  const divider = document.createElement('span');
  divider.style.display = 'inline-block';
  divider.style.width = '1px';
  divider.style.height = '24px';
  divider.style.backgroundColor = '#ccc';
  divider.style.margin = '0 4px';
  divider.setAttribute('aria-hidden', 'true');
  buttonsRow.appendChild(divider);

  // Start/Pause button
  const startBtn = document.createElement('button');
  startBtn.id = 'start-btn';
  startBtn.textContent = 'Start';
  applyBtnStyle(startBtn);
  buttonsRow.appendChild(startBtn);

  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.id = 'clear-btn';
  clearBtn.textContent = 'Clear';
  applyBtnStyle(clearBtn);
  clearBtn.addEventListener('click', () => {
    renderer.grid.clearCells();
    renderer.render(renderer.grid);
  });
  buttonsRow.appendChild(clearBtn);

  controlsDiv.appendChild(buttonsRow);

  // Speed control row
  const speedDiv = document.createElement('div');
  speedDiv.style.display = 'flex';
  speedDiv.style.gap = '10px';
  speedDiv.style.alignItems = 'center';
  speedDiv.style.justifyContent = 'center';

  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Simulation Speed: ';
  speedLabel.htmlFor = 'speed-select';
  speedLabel.style.fontWeight = 'bold';
  speedDiv.appendChild(speedLabel);

  const speedSelect = document.createElement('select');
  speedSelect.id = 'speed-select';
  speedSelect.style.padding = '6px 8px';
  speedSelect.style.fontSize = '14px';
  speedSelect.style.borderRadius = '4px';
  speedSelect.style.border = '1px solid #333';
  [
    { label: 'Normal', value: '0' },
    { label: '5 FPS', value: '5' },
    { label: '1 FPS', value: '1' },
  ].forEach(({ label, value }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    speedSelect.appendChild(option);
  });
  speedDiv.appendChild(speedSelect);

  controlsDiv.appendChild(speedDiv);

  // Protein selector
  const proteinDiv = document.createElement('div');
  proteinDiv.style.display = 'flex';
  proteinDiv.style.gap = '10px';
  proteinDiv.style.alignItems = 'center';
  proteinDiv.style.justifyContent = 'center';
  
  const proteinLabel = document.createElement('label');
  proteinLabel.textContent = 'Protein to inject: ';
  proteinLabel.style.fontWeight = 'bold';
  proteinDiv.appendChild(proteinLabel);
  
  const proteinInput = document.createElement('input');
  proteinInput.type = 'text';
  proteinInput.id = 'protein-input';
  proteinInput.value = 'R';
  proteinInput.style.padding = '6px 8px';
  proteinInput.style.fontSize = '14px';
  proteinInput.style.width = '100px';
  proteinInput.style.borderRadius = '4px';
  proteinInput.style.border = '1px solid #333';
  proteinInput.addEventListener('input', () => {
    renderer.setSelectedProtein(proteinInput.value);
  });
  proteinDiv.appendChild(proteinInput);
  
  controlsDiv.appendChild(proteinDiv);
  
  // Genetic code section (full width)
  const codeDiv = document.createElement('div');
  codeDiv.style.display = 'flex';
  codeDiv.style.flexDirection = 'column';
  codeDiv.style.gap = '4px';
  codeDiv.style.width = '100%';

  const codeLabel = document.createElement('label');
  codeLabel.textContent = 'Genetic Code: ';
  codeLabel.style.fontWeight = 'bold';
  codeLabel.htmlFor = 'genetic-code-input';
  codeDiv.appendChild(codeLabel);

  const codeTextarea = document.createElement('textarea');
  codeTextarea.id = 'genetic-code-input';
  codeTextarea.rows = 8;
  codeTextarea.style.width = '100%';
  codeTextarea.placeholder = 'e.g. R+10;G+5';
  const savedCode = typeof localStorage !== 'undefined' ? localStorage.getItem('geneticCode') : null;
  if (savedCode) {
    codeTextarea.value = savedCode;
  }
  codeDiv.appendChild(codeTextarea);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.style.color = 'red';
  errorMessageDiv.style.fontSize = '12px';
  errorMessageDiv.style.display = 'none';
  errorMessageDiv.setAttribute('role', 'alert');
  errorMessageDiv.setAttribute('aria-live', 'assertive');
  codeDiv.appendChild(errorMessageDiv);

  // Wire up Apply Code button (created in buttonsRow above)
  applyCodeBtn.addEventListener('click', () => {
    try {
      errorMessageDiv.textContent = '';
      errorMessageDiv.style.display = 'none';
      renderer.grid.setGeneticCode(new GeneticCode(codeTextarea.value));
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('geneticCode', codeTextarea.value);
      }
    } catch (error) {
      errorMessageDiv.textContent = error.message;
      errorMessageDiv.style.display = 'block';
    }
  });

  controlsDiv.appendChild(codeDiv);
  
  document.querySelector('.container').appendChild(controlsDiv);
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createControls;
}
