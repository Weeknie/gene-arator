export class Inspector {
  constructor(container) {
    this.container = container;
    this.grid = null;
    this.currentCell = null;
  }

  render() {
    this.container.innerHTML = '';

    const heading = document.createElement('h3');
    heading.textContent = 'Inspector';
    heading.className = 'inspector-heading';
    this.container.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'inspector-list';
    this.container.appendChild(list);
  }

  enableInspection(grid, gridContainer) {
    this.grid = grid;

    gridContainer.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('grid-cell')) {
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        const cell = this.grid.getCell(x, y);
        this.currentCell = cell;
        this._updateDisplay(cell);
      }
    });

    gridContainer.addEventListener('mouseleave', () => {
      this.currentCell = null;
      this._clearDisplay();
    });
  }

  tick() {
    if (this.currentCell !== null) {
      this._updateDisplay(this.currentCell);
    }
  }

  _updateDisplay(cell) {
    const list = this.container.querySelector('.inspector-list');
    list.innerHTML = '';

    let hasProteins = false;
    for (const [protein, amount] of cell.proteins.entries()) {
      if (amount > 0) {
        const item = document.createElement('li');
        item.className = 'inspector-item';
        item.textContent = `${protein}: ${Math.floor(amount)}`;
        list.appendChild(item);
        hasProteins = true;
      }
    }

    if (!hasProteins) {
      const empty = document.createElement('li');
      empty.className = 'inspector-empty';
      empty.textContent = 'No proteins';
      list.appendChild(empty);
    }
  }

  _clearDisplay() {
    const list = this.container.querySelector('.inspector-list');
    if (list) {
      list.innerHTML = '';
    }
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Inspector };
}
