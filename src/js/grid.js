/**
 * Grid module - core grid data structure and logic
 * Single Responsibility: Manage grid state and cell operations
 */
export class Grid {
    constructor(size) {
        this.size = size;
        this.cells = this.initializeCells();
    }

    /**
     * Initialize grid cells with default state
     * @returns {Array<Array<Object>>} - 2D array of cell objects
     */
    initializeCells() {
        const cells = [];
        for (let row = 0; row < this.size; row++) {
            cells[row] = [];
            for (let col = 0; col < this.size; col++) {
                cells[row][col] = {
                    row,
                    col,
                    active: false
                };
            }
        }
        return cells;
    }

    /**
     * Get grid size
     * @returns {number} - Grid size
     */
    getSize() {
        return this.size;
    }

    /**
     * Get all cells
     * @returns {Array<Array<Object>>} - 2D array of cells
     */
    getCells() {
        return this.cells;
    }

    /**
     * Get specific cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Object|null} - Cell object or null if out of bounds
     */
    getCell(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return null;
        }
        return this.cells[row][col];
    }

    /**
     * Toggle cell active state
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {boolean} - True if toggled successfully
     */
    toggleCell(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.active = !cell.active;
            return true;
        }
        return false;
    }
}
