/**
 * Configuration module - manages grid configuration
 * Single Responsibility: Handle configuration state and validation
 */
export class Config {
    constructor(defaultSize = 10) {
        this.gridSize = defaultSize;
        this.minSize = 1;
        this.maxSize = 50;
    }

    /**
     * Set grid size with validation
     * @param {number} size - The desired grid size
     * @returns {boolean} - True if size was valid and set, false otherwise
     */
    setGridSize(size) {
        const numSize = parseInt(size, 10);
        if (isNaN(numSize) || numSize < this.minSize || numSize > this.maxSize) {
            return false;
        }
        this.gridSize = numSize;
        return true;
    }

    /**
     * Get current grid size
     * @returns {number} - Current grid size
     */
    getGridSize() {
        return this.gridSize;
    }

    /**
     * Get configuration bounds
     * @returns {Object} - Object with min and max size
     */
    getBounds() {
        return {
            min: this.minSize,
            max: this.maxSize
        };
    }
}
