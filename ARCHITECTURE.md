# Architecture Diagram

## Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                          │
│                   (Entry Point)                          │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ loads
                  ▼
┌─────────────────────────────────────────────────────────┐
│                      app.js                              │
│                  (Orchestrator)                          │
│  - Initializes all modules                              │
│  - Coordinates interactions                             │
│  - Handles user events                                  │
└──────┬──────────────────┬──────────────────┬───────────┘
       │                  │                  │
       │ uses             │ uses             │ uses
       ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  config.js   │  │   grid.js    │  │    ui.js     │
│              │  │              │  │              │
│  Config      │  │    Grid      │  │     UI       │
│              │  │              │  │              │
│ Manages:     │  │ Manages:     │  │ Manages:     │
│ - Grid size  │  │ - Cell data  │  │ - Rendering  │
│ - Validation │  │ - Cell state │  │ - DOM events │
│ - Bounds     │  │ - Grid logic │  │ - Updates    │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Class Diagram

```
┌─────────────────────────┐
│       Config            │
├─────────────────────────┤
│ - gridSize: number      │
│ - minSize: number       │
│ - maxSize: number       │
├─────────────────────────┤
│ + setGridSize(size)     │
│ + getGridSize()         │
│ + getBounds()           │
└─────────────────────────┘

┌─────────────────────────┐
│        Grid             │
├─────────────────────────┤
│ - size: number          │
│ - cells: Cell[][]       │
├─────────────────────────┤
│ + initializeCells()     │
│ + getSize()             │
│ + getCells()            │
│ + getCell(row, col)     │
│ + toggleCell(row, col)  │
└─────────────────────────┘

┌─────────────────────────┐
│         UI              │
├─────────────────────────┤
│ - container: Element    │
├─────────────────────────┤
│ + renderGrid(grid, cb)  │
│ + updateCell(r, c, a)   │
└─────────────────────────┘

┌─────────────────────────┐
│         App             │
├─────────────────────────┤
│ - config: Config        │
│ - grid: Grid            │
│ - ui: UI                │
├─────────────────────────┤
│ + initializeEvents()    │
│ + handleCellClick(r,c)  │
│ + render()              │
└─────────────────────────┘
```

## Sequence Diagram: User Changes Grid Size

```
User          App         Config       Grid         UI
 │             │            │           │            │
 │─Input 20───▶│            │           │            │
 │─Click Apply▶│            │           │            │
 │             │            │           │            │
 │             │─setSize()─▶│           │            │
 │             │◀──true─────│           │            │
 │             │            │           │            │
 │             │─new Grid(20)──────────▶│            │
 │             │◀──────────────────────│            │
 │             │            │           │            │
 │             │─renderGrid(grid)──────────────────▶│
 │             │            │           │            │
 │             │            │           │◀─DOM update│
 │◀────────────────────────────────────────20x20 grid
```

## Key Architectural Principles

### Separation of Concerns
- **Config**: Pure configuration management, no UI or grid logic
- **Grid**: Pure data structure, no rendering or configuration
- **UI**: Pure presentation, no business logic
- **App**: Orchestration only, delegates to specialized modules

### Single Responsibility
Each module has one clear purpose:
- Config validates and stores settings
- Grid manages cell state and operations
- UI handles all DOM manipulation
- App coordinates the modules

### Loose Coupling
- Modules interact through well-defined interfaces
- No circular dependencies
- Grid doesn't know about UI
- Config doesn't know about Grid
- UI receives grid data as parameter

### Extensibility
Easy to extend with:
- New cell types (just modify Grid)
- Different rendering styles (just modify UI)
- Additional configuration options (just modify Config)
- New features (add to App, leverage existing modules)
