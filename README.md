# Gene-arator

A browser-based grid game skeleton built with Test-Driven Development (TDD) and hexagonal architecture principles.

![Grid Game Screenshot](https://github.com/user-attachments/assets/b5f09c43-a367-469f-a854-275097d79f19)

## Features

- 10x10 grid of interactive cells
- Clean, responsive design
- Hover effects on cells
- Test-driven development with Jest
- Hexagonal architecture (domain, adapters)

## Project Structure

```
gene-arator/
├── src/
│   ├── domain/           # Core business logic
│   │   ├── Cell.js       # Cell entity
│   │   └── Grid.js       # Grid entity
│   └── adapters/         # External adapters
│       └── GridRenderer.js  # DOM rendering adapter
├── tests/
│   ├── domain/           # Domain layer tests
│   └── adapters/         # Adapter layer tests
├── index.html            # Main HTML file
├── styles.css            # Styling
└── game.js              # Browser-compatible game logic
```

## Getting Started

### Running the Game

1. Open `index.html` in a web browser, or
2. Serve the files using a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`

### Running Tests

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

## Architecture

This project follows hexagonal architecture principles:

- **Domain Layer**: Contains the core business logic (Cell, Grid)
- **Adapter Layer**: Handles external concerns (GridRenderer for DOM)
- **Clear Boundaries**: Domain doesn't depend on adapters

## TDD Approach

The project was built following strict TDD methodology:

1. **RED**: Write failing tests first
2. **GREEN**: Write minimal code to pass tests
3. **REFACTOR**: Improve code quality while keeping tests green

All 12 tests are passing with comprehensive coverage of:
- Cell creation and properties
- Grid initialization and cell access
- DOM rendering and structure

## License

ISC