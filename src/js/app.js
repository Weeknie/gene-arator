/**
 * Main application entry point
 * Orchestrates the interaction between Config, Grid, and UI modules
 */
import { Config } from './config.js';
import { Grid } from './grid.js';
import { UI } from './ui.js';

class App {
    constructor() {
        this.config = new Config(10);
        this.grid = new Grid(this.config.getGridSize());
        this.ui = new UI('#grid-container');
        
        this.initializeEventHandlers();
        this.render();
    }

    /**
     * Initialize event handlers for user interactions
     */
    initializeEventHandlers() {
        const applyButton = document.getElementById('apply-size');
        const sizeInput = document.getElementById('grid-size');

        applyButton.addEventListener('click', () => {
            const newSize = sizeInput.value;
            if (this.config.setGridSize(newSize)) {
                this.grid = new Grid(this.config.getGridSize());
                this.render();
            } else {
                const bounds = this.config.getBounds();
                alert(`Please enter a valid size between ${bounds.min} and ${bounds.max}`);
            }
        });

        // Allow Enter key to apply size
        sizeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyButton.click();
            }
        });
    }

    /**
     * Handle cell click events
     */
    handleCellClick(row, col) {
        if (this.grid.toggleCell(row, col)) {
            const cell = this.grid.getCell(row, col);
            this.ui.updateCell(row, col, cell.active);
        }
    }

    /**
     * Render the grid
     */
    render() {
        this.ui.renderGrid(this.grid, (row, col) => {
            this.handleCellClick(row, col);
        });
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
