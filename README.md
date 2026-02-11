# Gene-arator 🧬

A grid-based genetic protein simulation game prototype. This project simulates a grid of cells where proteins are produced based on genetic code and current protein concentrations. Proteins can propagate to neighboring cells based on their properties.

## Features

- **Grid-based simulation**: A 2D grid of cells that can contain different proteins
- **Genetic code**: Rules that determine which proteins are produced based on current protein concentrations
- **Protein propagation**: Proteins spread to neighboring cells based on propagation distance properties
- **Dynamic behavior**: Each simulation step produces new proteins and propagates existing ones

## Architecture

### Core Components

- **Protein**: Represents a protein type with properties like propagation distance and concentration
- **GeneticCode**: Contains rules that determine protein production based on conditions
- **Cell**: Individual cells in the grid that store proteins and execute genetic code
- **Grid**: Manages the grid of cells and handles protein propagation between cells

### How It Works

1. **Initialization**: Create a grid with cells, each having a genetic code
2. **Production**: In each step, cells evaluate their genetic code against current protein concentrations
3. **Propagation**: Proteins spread to neighboring cells based on their propagation distance
4. **Iteration**: The simulation continues for multiple steps, creating complex protein patterns

## Installation

```bash
npm install
```

## Usage

### Run the Demo

```bash
npm run demo
```

This runs a simple demonstration showing a 5x5 grid with protein production and propagation.

### Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Use as a Library

```typescript
import { Grid, GeneticCode, ProteinType, GeneRule } from 'gene-arator';

// Define protein types
const proteinA: ProteinType = {
  id: 'A',
  name: 'Protein A',
  propagationDistance: 1,
  symbol: 'A'
};

// Create genetic code with rules
const geneticCode = new GeneticCode([
  {
    conditions: new Map(), // No conditions
    production: new Map([['A', 2]]) // Produce 2 units of A
  } as GeneRule
]);

// Create a grid
const grid = new Grid(5, 5, geneticCode);
grid.registerProteinType(proteinA);

// Run simulation steps
grid.step();
```

## Project Structure

```
gene-arator/
├── src/
│   ├── Protein.ts      # Protein and ProteinType definitions
│   ├── GeneticCode.ts  # Genetic code rules and evaluation
│   ├── Cell.ts         # Cell implementation
│   ├── Grid.ts         # Grid management and propagation
│   ├── index.ts        # Main exports
│   └── demo.ts         # Demo application
├── dist/               # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Example Genetic Code

A genetic code can have multiple rules with conditions:

```typescript
const geneticCode = new GeneticCode([
  // Rule 1: Always produce protein A
  {
    conditions: new Map(),
    production: new Map([['A', 2]])
  },
  // Rule 2: If A >= 5, produce protein B
  {
    conditions: new Map([['A', 5]]),
    production: new Map([['B', 1]])
  },
  // Rule 3: If B >= 3, produce protein C
  {
    conditions: new Map([['B', 3]]),
    production: new Map([['C', 1]])
  }
]);
```

## Future Development

This prototype can be extended with:
- Different genetic codes for different cells
- Mutations in genetic code
- Cell division and growth
- Interactive visualization (web UI)
- More complex propagation models
- Cell death and resource consumption
- User-defined protein interactions

## Contributing

This project is set up for development with GitHub Copilot agents. See the `.github/agents/` directory for agent instructions.

## License

ISC