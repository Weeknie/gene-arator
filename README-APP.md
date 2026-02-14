# Gene-arator Grid Application

A modular web application featuring a configurable grid of interactive square cells.

## Features

- **Configurable Grid Size**: Default 10x10, adjustable from 1 to 50
- **Interactive Cells**: Click any cell to toggle between active and inactive states
- **Responsive Design**: Clean, modern interface with gradient styling
- **No Build Tools Required**: Pure HTML/CSS/JavaScript using ES6 modules

## Getting Started

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/Weeknie/gene-arator.git
cd gene-arator
```

2. Start a local web server:
```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js
npx http-server -p 8080

# Or using PHP
php -S localhost:8080
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

1. **View the Grid**: The application loads with a default 10x10 grid
2. **Change Grid Size**: 
   - Enter a number between 1 and 50 in the input field
   - Click the "Apply" button or press Enter
3. **Interact with Cells**: Click any cell to toggle its active state

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **config.js**: Configuration management and validation
- **grid.js**: Grid data structure and cell state management
- **ui.js**: DOM rendering and user interaction
- **app.js**: Application orchestration and event handling
- **styles.css**: Visual presentation

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Browser Support

This application uses ES6 modules and modern JavaScript features. It requires:
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+

## License

This project is part of the Gene-arator repository showcasing custom GitHub Copilot agents working together using TDD principles.
