# Contributing to Gene-arator

Thank you for your interest in contributing to Gene-arator! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- TypeScript knowledge

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/gene-arator.git`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Run the demo: `npm run demo`

## Project Structure

```
gene-arator/
├── src/               # Source TypeScript files
│   ├── Protein.ts     # Protein types and instances
│   ├── GeneticCode.ts # Genetic code rules
│   ├── Cell.ts        # Cell implementation
│   ├── Grid.ts        # Grid management
│   ├── index.ts       # Public API
│   ├── demo.ts        # Demo application
│   └── examples.ts    # Usage examples
├── dist/              # Compiled JavaScript (generated)
├── .github/
│   └── agents/        # AI agent instructions
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project metadata
```

## Development Workflow

### Making Changes
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Build: `npm run build`
4. Test your changes: `npm run demo`
5. Commit your changes with a clear message
6. Push to your fork
7. Create a Pull Request

### Code Style
- Use TypeScript with strict mode
- Follow existing naming conventions:
  - PascalCase for classes and types
  - camelCase for variables and methods
  - UPPER_CASE for constants
- Add JSDoc comments for public APIs
- Use meaningful variable names
- Keep functions small and focused

### Example Commit Messages
- `feat: Add protein mutation feature`
- `fix: Correct propagation distance calculation`
- `docs: Update README with new examples`
- `refactor: Simplify genetic code evaluation`
- `test: Add tests for Cell class`

## Testing

### Manual Testing
Run the demo and examples to verify changes:
```bash
npm run build
npm run demo
npm run examples
```

### Future: Automated Testing
We plan to add a test suite. When available:
```bash
npm test
npm run test:watch
```

## Areas for Contribution

### Core Features
- [ ] Add cell division mechanics
- [ ] Implement protein degradation over time
- [ ] Add resource consumption system
- [ ] Create mutation mechanism for genetic codes
- [ ] Support for multiple layers/dimensions

### Visualization
- [ ] Web-based visualization (HTML5 Canvas)
- [ ] Interactive controls (pause, step, speed)
- [ ] Color-coded protein display
- [ ] Graph of protein concentrations over time
- [ ] Export to image/video

### Developer Experience
- [ ] Add comprehensive test suite
- [ ] Create detailed API documentation
- [ ] Add more example scenarios
- [ ] Create interactive tutorial
- [ ] Performance profiling tools

### Documentation
- [ ] API reference documentation
- [ ] Tutorial for creating custom genetic codes
- [ ] Guide for game mechanics design
- [ ] Architecture decision records
- [ ] Video tutorials

## Working with GitHub Copilot Agents

This project is designed to work well with GitHub Copilot agents. See `.github/agents/` for specialized agent instructions.

### Available Agent Roles
- **agent-instructions.md**: General project guidelines
- **game-logic-developer.md**: For game mechanics changes
- **visualization-developer.md**: For display and UI work
- **testing-specialist.md**: For testing infrastructure

### Tips for Agent-Assisted Development
1. Review relevant agent instructions before starting
2. Use the demo to verify changes
3. Keep changes focused and incremental
4. Update documentation when adding features
5. Test edge cases

## Code Review Process

### What We Look For
- **Correctness**: Does it work as intended?
- **Testing**: Has it been tested manually or automatically?
- **Documentation**: Are public APIs documented?
- **Style**: Does it follow project conventions?
- **Performance**: Does it maintain good performance?
- **Security**: Are there any security concerns?

### Review Timeline
- Initial review: 1-3 days
- Maintainers may request changes
- Be responsive to feedback

## Reporting Issues

### Bug Reports
Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Node version, OS)

### Feature Requests
Include:
- Use case description
- Proposed solution (if any)
- Alternatives considered
- Impact on existing functionality

## Questions?

- Open an issue for questions about the project
- Tag issues with appropriate labels
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks
- Publishing others' private information

## Recognition

Contributors will be recognized in:
- Git commit history
- Release notes (for significant contributions)
- README contributors section (future)

Thank you for contributing to Gene-arator! 🧬
