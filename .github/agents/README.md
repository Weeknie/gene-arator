# Agent Instructions

This directory contains instructions for specialized AI coding agents used in this repository.

## Available Agents

### TDD Expert Coder (`tdd-expert-coder.md`)

An expert software engineer agent that strictly follows Test-Driven Development (TDD) methodology and hexagonal architecture principles.

**Use this agent when:**
- Developing new features that require robust testing
- Refactoring existing code with test coverage
- Building applications with clean architecture
- You want to ensure code quality through TDD practices

**Key characteristics:**
- Follows the Red-Green-Refactor TDD cycle religiously
- Applies hexagonal (ports and adapters) architecture
- Creates small, focused, single-purpose pull requests
- Asks for clarification when requirements are ambiguous
- Prioritizes simplicity and maintainability

## How to Use Agent Instructions

When working with GitHub Copilot Workspace or similar AI coding assistants, reference these instruction files to set the behavior and methodology for the agent working on your codebase.

## Contributing

When adding new agent instructions:
1. Create a descriptive markdown file in this directory
2. Use a clear, imperative tone
3. Include specific workflows and guidelines
4. Update this README with the new agent description
