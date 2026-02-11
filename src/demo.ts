import { Grid, GeneticCode, ProteinType, GeneRule } from './index';

/**
 * Demo application showing the gene-arator prototype
 */
class Demo {
  private grid: Grid;
  private proteinTypes: ProteinType[];

  constructor() {
    // Define some protein types
    this.proteinTypes = [
      {
        id: 'A',
        name: 'Protein A',
        propagationDistance: 1,
        symbol: 'A'
      },
      {
        id: 'B',
        name: 'Protein B',
        propagationDistance: 2,
        symbol: 'B'
      },
      {
        id: 'C',
        name: 'Protein C',
        propagationDistance: 1,
        symbol: 'C'
      }
    ];

    // Create a simple genetic code
    // Rule 1: If no proteins, produce A
    // Rule 2: If A >= 5, produce B
    // Rule 3: If B >= 3, produce C
    const geneticCode = new GeneticCode([
      {
        conditions: new Map(),
        production: new Map([['A', 2]])
      } as GeneRule,
      {
        conditions: new Map([['A', 5]]),
        production: new Map([['B', 1]])
      } as GeneRule,
      {
        conditions: new Map([['B', 3]]),
        production: new Map([['C', 1]])
      } as GeneRule
    ]);

    // Create a 5x5 grid
    this.grid = new Grid(5, 5, geneticCode);

    // Register protein types
    for (const proteinType of this.proteinTypes) {
      this.grid.registerProteinType(proteinType);
    }
  }

  /**
   * Visualize the grid state
   */
  visualize(): void {
    const { width, height } = this.grid.getDimensions();
    
    console.log('\n' + '='.repeat(width * 8));
    console.log('Grid State:');
    console.log('='.repeat(width * 8));
    
    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        const cell = this.grid.getCell(x, y)!;
        const proteins = cell.getAllProteins();
        
        if (proteins.length === 0 || proteins.every(p => p.concentration === 0)) {
          row += '  .    ';
        } else {
          // Show dominant protein
          const dominant = proteins.reduce((max, p) => 
            p.concentration > max.concentration ? p : max
          );
          const conc = Math.round(dominant.concentration);
          row += ` ${dominant.type.symbol}:${conc.toString().padStart(2)} `;
        }
      }
      console.log(row);
    }
    console.log('='.repeat(width * 8) + '\n');
  }

  /**
   * Print protein concentrations for all cells
   */
  printDetails(): void {
    console.log('Detailed Cell Information:');
    console.log('-'.repeat(60));
    
    const { width, height } = this.grid.getDimensions();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = this.grid.getCell(x, y)!;
        const proteins = cell.getAllProteins().filter(p => p.concentration > 0);
        
        if (proteins.length > 0) {
          const proteinStr = proteins
            .map(p => `${p.type.symbol}:${p.concentration.toFixed(1)}`)
            .join(', ');
          console.log(`Cell (${x},${y}): ${proteinStr}`);
        }
      }
    }
    console.log('-'.repeat(60) + '\n');
  }

  /**
   * Run the simulation for a number of steps
   */
  run(steps: number): void {
    console.log(`\n🧬 Gene-arator Prototype Demo 🧬`);
    console.log(`Starting simulation with ${steps} steps...\n`);

    this.visualize();

    for (let i = 1; i <= steps; i++) {
      console.log(`\nStep ${i}:`);
      this.grid.step();
      this.visualize();
      
      if (i % 3 === 0) {
        this.printDetails();
      }
    }

    console.log('Simulation complete!');
  }
}

// Run the demo
const demo = new Demo();
demo.run(6);
