import { Grid, GeneticCode, ProteinType, GeneRule } from './index';

/**
 * Example 1: Simple single protein system
 */
export function simpleExample() {
  console.log('\n=== Example 1: Simple Single Protein ===\n');

  // Define a simple protein
  const proteinA: ProteinType = {
    id: 'A',
    name: 'Protein Alpha',
    propagationDistance: 1,
    symbol: 'α'
  };

  // Create genetic code that always produces protein A
  const geneticCode = new GeneticCode([
    {
      conditions: new Map(),
      production: new Map([['A', 1]])
    } as GeneRule
  ]);

  // Create a small grid
  const grid = new Grid(3, 3, geneticCode);
  grid.registerProteinType(proteinA);

  // Run simulation
  console.log('Initial state:');
  printGrid(grid);

  for (let i = 1; i <= 3; i++) {
    grid.step();
    console.log(`\nAfter step ${i}:`);
    printGrid(grid);
  }
}

/**
 * Example 2: Multi-protein feedback system
 */
export function feedbackExample() {
  console.log('\n=== Example 2: Feedback System ===\n');

  // Define two proteins
  const proteinA: ProteinType = {
    id: 'A',
    name: 'Activator',
    propagationDistance: 2,
    symbol: 'A'
  };

  const proteinB: ProteinType = {
    id: 'B',
    name: 'Inhibitor',
    propagationDistance: 1,
    symbol: 'B'
  };

  // Create genetic code with feedback
  // A produces itself and B
  // B inhibits A production (demonstrated by different rule)
  const geneticCode = new GeneticCode([
    {
      conditions: new Map(),
      production: new Map([['A', 2]])
    } as GeneRule,
    {
      conditions: new Map([['A', 3]]),
      production: new Map([['B', 1]])
    } as GeneRule
  ]);

  const grid = new Grid(4, 4, geneticCode);
  grid.registerProteinType(proteinA);
  grid.registerProteinType(proteinB);

  console.log('Initial state:');
  printGrid(grid);

  for (let i = 1; i <= 4; i++) {
    grid.step();
    console.log(`\nAfter step ${i}:`);
    printGrid(grid);
  }
}

/**
 * Example 3: Different genetic codes in different cells
 */
export function variantCellsExample() {
  console.log('\n=== Example 3: Cell Variants ===\n');

  const proteinA: ProteinType = {
    id: 'A',
    name: 'Protein A',
    propagationDistance: 1,
    symbol: 'A'
  };

  const proteinB: ProteinType = {
    id: 'B',
    name: 'Protein B',
    propagationDistance: 1,
    symbol: 'B'
  };

  // Default: produces A
  const geneCodeA = new GeneticCode([
    {
      conditions: new Map(),
      production: new Map([['A', 2]])
    } as GeneRule
  ]);

  // Variant: produces B
  const geneCodeB = new GeneticCode([
    {
      conditions: new Map(),
      production: new Map([['B', 2]])
    } as GeneRule
  ]);

  // Create grid with default genetic code
  const grid = new Grid(5, 5, geneCodeA);
  grid.registerProteinType(proteinA);
  grid.registerProteinType(proteinB);

  // Change genetic code of center cell
  const centerCell = grid.getCell(2, 2);
  if (centerCell) {
    centerCell.setGeneticCode(geneCodeB);
  }

  console.log('Center cell has different genetic code');
  console.log('Initial state:');
  printGrid(grid);

  for (let i = 1; i <= 3; i++) {
    grid.step();
    console.log(`\nAfter step ${i}:`);
    printGrid(grid);
  }
}

/**
 * Helper function to print grid
 */
function printGrid(grid: Grid) {
  const { width, height } = grid.getDimensions();

  for (let y = 0; y < height; y++) {
    let row = '';
    for (let x = 0; x < width; x++) {
      const cell = grid.getCell(x, y)!;
      const proteins = cell.getAllProteins();

      if (proteins.length === 0 || proteins.every(p => p.concentration === 0)) {
        row += '  .  ';
      } else {
        // Show all proteins with concentration > 0.5
        const visible = proteins.filter(p => p.concentration >= 0.5);
        if (visible.length === 0) {
          row += '  .  ';
        } else {
          const display = visible
            .map(p => `${p.type.symbol}${Math.round(p.concentration)}`)
            .join('');
          row += ` ${display.padEnd(4)} `;
        }
      }
    }
    console.log(row);
  }
}

// Run examples if executed directly
if (require.main === module) {
  simpleExample();
  feedbackExample();
  variantCellsExample();
}
