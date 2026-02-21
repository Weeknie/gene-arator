/* global GeneticCode */
const GeneticCode = typeof module !== 'undefined' ? require('../domain/GeneticCode') : window.GeneticCode;

function createControls(renderer, grid) {
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
  codeTextarea.rows = 3;
  codeTextarea.style.width = '200px';
  codeTextarea.placeholder = 'e.g. R+10;G+5';
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
    } catch (error) {
      errorMessageDiv.textContent = error.message;
      errorMessageDiv.style.display = 'block';
    }
  });
  codeDiv.appendChild(applyCodeBtn);
  
  controlsDiv.appendChild(codeDiv);
  
  document.getElementById('game-container').parentElement.appendChild(controlsDiv);
}

if (typeof module !== 'undefined') module.exports = createControls;
if (typeof window !== 'undefined') window.createControls = createControls;
