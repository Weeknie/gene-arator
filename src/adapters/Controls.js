import * as GeneticCodeModule from '../domain/GeneticCode.js';
const GeneticCode = GeneticCodeModule.GeneticCode || GeneticCodeModule.default || GeneticCodeModule;

export function createControls(renderer, grid) {
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'controls';
  controlsDiv.style.marginTop = '20px';
  controlsDiv.style.display = 'flex';
  controlsDiv.style.flexDirection = 'column';
  controlsDiv.style.gap = '10px';
  controlsDiv.style.alignItems = 'center';
  
  // Start/Pause button
  const startBtn = document.createElement('button');
  startBtn.id = 'start-btn';
  startBtn.textContent = 'Start';
  startBtn.style.padding = '10px 20px';
  startBtn.style.fontSize = '16px';
  startBtn.style.cursor = 'pointer';
  controlsDiv.appendChild(startBtn);
  
  // Protein selector
  const proteinDiv = document.createElement('div');
  proteinDiv.style.display = 'flex';
  proteinDiv.style.gap = '10px';
  proteinDiv.style.alignItems = 'center';
  
  const proteinLabel = document.createElement('label');
  proteinLabel.textContent = 'Protein: ';
  proteinLabel.style.fontWeight = 'bold';
  proteinDiv.appendChild(proteinLabel);
  
  ['R', 'G', 'B'].forEach(protein => {
    const btn = document.createElement('button');
    btn.textContent = protein;
    btn.style.padding = '8px 16px';
    btn.style.cursor = 'pointer';
    btn.style.border = '2px solid #333';
    btn.style.borderRadius = '4px';
    
    if (protein === 'R') {
      btn.style.backgroundColor = '#ffcccc';
      btn.style.fontWeight = 'bold';
    } else if (protein === 'G') {
      btn.style.backgroundColor = '#ccffcc';
    } else {
      btn.style.backgroundColor = '#ccccff';
    }
    
    btn.addEventListener('click', () => {
      renderer.setSelectedProtein(protein);
      // Update all buttons to show selection
      proteinDiv.querySelectorAll('button').forEach(b => {
        b.style.fontWeight = 'normal';
        b.style.border = '2px solid #333';
      });
      btn.style.fontWeight = 'bold';
      btn.style.border = '2px solid #000';
    });
    
    if (protein === 'R') {
      btn.style.border = '2px solid #000';
    }
    
    proteinDiv.appendChild(btn);
  });
  
  controlsDiv.appendChild(proteinDiv);
  
  // Genetic code textarea
  const codeDiv = document.createElement('div');
  codeDiv.style.display = 'flex';
  codeDiv.style.gap = '10px';
  codeDiv.style.alignItems = 'flex-start';
  
  const codeLabel = document.createElement('label');
  codeLabel.textContent = 'Genetic Code: ';
  codeLabel.style.fontWeight = 'bold';
  codeLabel.htmlFor = 'genetic-code-input';
  codeDiv.appendChild(codeLabel);
  
  const codeTextarea = document.createElement('textarea');
  codeTextarea.id = 'genetic-code-input';
  codeTextarea.rows = 8;
  codeTextarea.style.width = '300px';
  codeTextarea.placeholder = 'e.g. R+10;G+5';
  const savedCode = typeof localStorage !== 'undefined' ? localStorage.getItem('geneticCode') : null;
  if (savedCode) {
    codeTextarea.value = savedCode;
  }
  codeDiv.appendChild(codeTextarea);
  
  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.style.color = 'red';
  errorMessageDiv.style.fontSize = '12px';
  errorMessageDiv.style.marginTop = '5px';
  errorMessageDiv.style.display = 'none';
  errorMessageDiv.setAttribute('role', 'alert');
  errorMessageDiv.setAttribute('aria-live', 'assertive');
  codeDiv.appendChild(errorMessageDiv);
  
  const applyCodeBtn = document.createElement('button');
  applyCodeBtn.textContent = 'Apply Code';
  applyCodeBtn.style.padding = '6px 12px';
  applyCodeBtn.style.cursor = 'pointer';
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
  codeDiv.appendChild(applyCodeBtn);
  
  const clearBtn = document.createElement('button');
  clearBtn.id = 'clear-btn';
  clearBtn.textContent = 'Clear';
  clearBtn.style.padding = '6px 12px';
  clearBtn.style.cursor = 'pointer';
  clearBtn.addEventListener('click', () => {
    renderer.grid.clearCells();
    renderer.render(renderer.grid);
  });
  codeDiv.appendChild(clearBtn);
  
  controlsDiv.appendChild(codeDiv);
  
  document.querySelector('.container').appendChild(controlsDiv);
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createControls;
}
