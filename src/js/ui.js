/**
 * UI module - handles rendering and user interaction
 * Single Responsibility: Manage DOM manipulation and user events
 */
export class UI {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(`Container not found: ${containerSelector}`);
        }
    }

    /**
     * Render grid to DOM
     * @param {Grid} grid - Grid instance to render
     * @param {Function} onCellClick - Callback for cell click events
     */
    renderGrid(grid, onCellClick) {
        // Clear existing content
        this.container.innerHTML = '';

        const size = grid.getSize();
        const cells = grid.getCells();

        // Create grid element
        const gridElement = document.createElement('div');
        gridElement.className = 'grid';
        gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        // Create cell elements
        cells.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;
                
                if (cell.active) {
                    cellElement.classList.add('active');
                }

                // Add click handler
                if (onCellClick) {
                    cellElement.addEventListener('click', () => {
                        onCellClick(rowIndex, colIndex);
                    });
                }

                gridElement.appendChild(cellElement);
            });
        });

        this.container.appendChild(gridElement);
    }

    /**
     * Update single cell in DOM
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {boolean} active - Active state
     */
    updateCell(row, col, active) {
        const cellElement = this.container.querySelector(
            `.cell[data-row="${row}"][data-col="${col}"]`
        );
        
        if (cellElement) {
            if (active) {
                cellElement.classList.add('active');
            } else {
                cellElement.classList.remove('active');
            }
        }
    }
}
