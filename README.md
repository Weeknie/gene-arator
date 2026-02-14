# gene-arator

A repository for custom GitHub Copilot agents that work together following Test-Driven Development (TDD) principles.

## Available Agents

### 🏗️ Architect Agent
**Purpose**: Guides architectural decisions and ensures modular, maintainable system design.

**Key Responsibilities**:
- Provides requirements to the Tester agent
- Offers refactoring guidance to the Coder agent
- Creates UML diagrams for pull requests
- Ensures architectural consistency and best practices

### 🧪 Tester Agent
**Purpose**: Writes failing unit tests that drive development following TDD principles.

**Key Responsibilities**:
- Queries the Architect for feature requirements
- Writes concise, failing unit tests for new functionality
- Writes integration tests after feature completion
- Validates that implementations meet test requirements

**TDD Approach**: Red phase - writes tests that fail until implementation exists

### 💻 Coder Agent
**Purpose**: Implements code to make tests pass, following the simplest-first approach.

**Key Responsibilities**:
- Implements the simplest solution to make failing tests pass
- Queries the Architect before significant refactoring
- Refactors code to improve design while keeping tests green
- Commits test and implementation code together

**TDD Approach**: Green phase (make tests pass) → Refactor phase (improve design)

## TDD Workflow

The agents work together in a continuous cycle:

1. **Tester** queries **Architect** for requirements
2. **Tester** writes a failing unit test
3. **Coder** implements simplest solution to pass the test
4. **Coder** queries **Architect** for refactoring guidance (if needed)
5. **Coder** refactors while keeping tests green
6. **Coder** commits test + implementation together
7. Repeat steps 1-6 for each increment of functionality
8. **Tester** writes integration tests when feature is complete
9. **Architect** creates UML diagram for the PR

## Agent Configuration

All agents are configured in `.github/agents/*.agent.md` files following GitHub Copilot's custom agent format.

## Best Practices Implemented

- **Modular Architecture**: Agents have clear, focused responsibilities
- **Collaborative Workflow**: Agents query each other for guidance and requirements
- **Test-Driven Development**: Code is driven by tests, not the other way around
- **Incremental Implementation**: Small, focused changes with frequent commits
- **Documentation**: UML diagrams provide visual documentation of changes