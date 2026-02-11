# Agent Instructions for Gene-arator

## Project Overview

Gene-arator is a grid-based genetic protein simulation game prototype written in TypeScript. The project simulates cells in a grid where proteins are produced based on genetic code rules and propagate between cells.

## Core Concepts

### Architecture
- **Protein**: Entities with concentration levels and propagation properties
- **GeneticCode**: Rules that determine protein production based on current state
- **Cell**: Grid units that store proteins and execute genetic code
- **Grid**: Manages cells and coordinates protein propagation

### Key Behaviors
1. Cells produce proteins based on genetic code evaluation
2. Proteins propagate to neighboring cells within propagation distance
3. Propagation uses Manhattan distance for range calculation
4. Each simulation step consists of production followed by propagation

## Development Guidelines

### Code Style
- Use TypeScript with strict mode enabled
- Follow existing naming conventions (PascalCase for classes, camelCase for methods/variables)
- Add JSDoc comments for public methods and classes
- Keep methods focused and single-purpose
- Use readonly where appropriate for immutability

### Project Structure
```
src/
├── Protein.ts      - Protein types and instances
├── GeneticCode.ts  - Genetic rules and evaluation
├── Cell.ts         - Cell implementation
├── Grid.ts         - Grid management
├── index.ts        - Public API exports
└── demo.ts         - Example usage
```

### Testing Strategy
- When adding tests, use a testing framework like Jest or Vitest
- Test core logic: genetic code evaluation, propagation, and production
- Use mock data for protein types and genetic codes
- Test edge cases: empty grids, zero concentrations, boundary cells

### Building and Running
- Build: `npm run build` - Compiles TypeScript to dist/
- Demo: `npm run demo` - Runs the demonstration
- The project uses tsx for running TypeScript directly during development

## Agent-Specific Guidelines

### When Adding Features
1. **Understand the system**: Read existing code to understand patterns
2. **Maintain consistency**: Follow existing code style and architecture
3. **Update documentation**: Modify README.md if adding user-facing features
4. **Test changes**: Run `npm run build` and `npm run demo` to verify
5. **Keep it minimal**: Make the smallest changes necessary

### When Fixing Bugs
1. **Reproduce first**: Understand the issue by running the demo
2. **Locate the problem**: Use grep/glob to find relevant code
3. **Fix precisely**: Change only what's needed to fix the bug
4. **Verify**: Ensure the demo still works correctly

### When Refactoring
1. **Preserve behavior**: Don't change functionality during refactoring
2. **Test incrementally**: Verify after each small change
3. **Update types**: Ensure TypeScript types remain accurate
4. **Document changes**: Update comments if they become outdated

## Common Tasks

### Adding a New Protein Property
1. Update the `ProteinType` interface in `Protein.ts`
2. Update any logic that uses protein properties (e.g., in `Grid.ts`)
3. Update the demo to showcase the new property
4. Update README with examples

### Modifying Genetic Code Rules
1. Understand current rule evaluation in `GeneticCode.ts`
2. Modify the `GeneRule` interface or evaluation logic
3. Update demo with examples of new rule types
4. Ensure backward compatibility if possible

### Changing Propagation Logic
1. Locate propagation code in `Grid.propagateProteins()`
2. Understand current Manhattan distance calculation
3. Modify algorithm as needed
4. Test with different grid sizes and propagation distances

### Adding Visualization Features
1. Look at `demo.ts` for current visualization
2. Add new visualization methods that don't break existing ones
3. Consider terminal output limitations (use ASCII art)
4. Update README with new visualization options

## Important Constraints

### What to Preserve
- Public API in `index.ts` - changing this breaks consumers
- Core class structure (Protein, Cell, Grid, GeneticCode)
- TypeScript strict mode compilation
- Existing genetic code rule format for backward compatibility

### What Can Change
- Internal implementation details
- Private methods and properties
- Demo visualization (as long as it still works)
- Performance optimizations that don't change behavior

## Best Practices

1. **Type Safety**: Leverage TypeScript's type system fully
2. **Immutability**: Use readonly and const where appropriate
3. **Functional Patterns**: Prefer pure functions and avoid side effects when possible
4. **Clear Naming**: Use descriptive names that explain purpose
5. **Small Commits**: Make incremental changes and commit frequently
6. **Documentation**: Keep README and JSDoc comments up to date

## Getting Help

- Check existing code for patterns and examples
- Read the README for high-level architecture
- Run the demo to see how components interact
- Use grep to find usage examples: `grep -r "ClassName" src/`

## Security Considerations

- Validate input parameters (grid dimensions, concentrations, etc.)
- Prevent infinite loops in genetic code evaluation
- Handle edge cases in propagation (e.g., single cell grids)
- Avoid integer overflow in concentration calculations
