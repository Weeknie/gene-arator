use wasm_bindgen::prelude::*;

/// A single cell in the grid, holding R, G, B protein amounts.
#[derive(Clone)]
struct Cell {
    r: f64,
    g: f64,
    b: f64,
}

impl Cell {
    fn new() -> Self {
        Cell { r: 0.0, g: 0.0, b: 0.0 }
    }
}

/// A simple Linear Congruential Generator for reproducible randomness without
/// depending on the `rand` crate (which requires additional WASM setup).
struct Lcg {
    state: u64,
}

impl Lcg {
    fn new(seed: u64) -> Self {
        Lcg { state: seed }
    }

    /// Returns the next pseudo-random number in [0, 1).
    fn next_f64(&mut self) -> f64 {
        // Parameters from Knuth's MMIX LCG
        self.state = self.state
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        (self.state >> 33) as f64 / (1u64 << 31) as f64
    }

    /// Returns a value in [0, max].
    fn next_range(&mut self, max: f64) -> f64 {
        self.next_f64() * max
    }
}

/// The WASM-exposed grid that holds cells with R, G, B proteins.
///
/// This is the core Rust engine for the gene-arator simulation. It currently
/// supports:
///   - Creating a grid of arbitrary size
///   - Randomising all cells with R, G, B protein values
///   - Exposing protein data to JavaScript for rendering
#[wasm_bindgen]
pub struct WasmGrid {
    width: usize,
    height: usize,
    cells: Vec<Cell>,
}

#[wasm_bindgen]
impl WasmGrid {
    /// Create a new, empty grid.
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> WasmGrid {
        let cells = vec![Cell::new(); width * height];
        WasmGrid { width, height, cells }
    }

    /// Fill every cell with random R, G, B protein amounts in [0, 255].
    /// An optional seed can be supplied for reproducibility; pass 0 to use a
    /// time-based default.
    pub fn randomize(&mut self, seed: u32) {
        let actual_seed = if seed == 0 { 42 } else { seed as u64 };
        let mut rng = Lcg::new(actual_seed);
        for cell in self.cells.iter_mut() {
            cell.r = rng.next_range(255.0);
            cell.g = rng.next_range(255.0);
            cell.b = rng.next_range(255.0);
        }
    }

    /// Return the width of the grid.
    pub fn width(&self) -> usize {
        self.width
    }

    /// Return the height of the grid.
    pub fn height(&self) -> usize {
        self.height
    }

    /// Return the R protein amount for the cell at (x, y).
    pub fn get_r(&self, x: usize, y: usize) -> f64 {
        self.cells[y * self.width + x].r
    }

    /// Return the G protein amount for the cell at (x, y).
    pub fn get_g(&self, x: usize, y: usize) -> f64 {
        self.cells[y * self.width + x].g
    }

    /// Return the B protein amount for the cell at (x, y).
    pub fn get_b(&self, x: usize, y: usize) -> f64 {
        self.cells[y * self.width + x].b
    }

    /// Return all protein data as a flat array: [r0, g0, b0, r1, g1, b1, …].
    ///
    /// The order is row-major (y = 0..height, x = 0..width within each row).
    /// Reading the entire grid in one call avoids repeated JS↔WASM boundary
    /// crossings and is the preferred way for JavaScript to access grid data.
    pub fn get_proteins_flat(&self) -> Vec<f64> {
        let mut buf = Vec::with_capacity(self.cells.len() * 3);
        for cell in &self.cells {
            buf.push(cell.r);
            buf.push(cell.g);
            buf.push(cell.b);
        }
        buf
    }

    /// Apply a single simulation tick: diffusion then decay.
    ///
    /// - `diffusion_rate`: fraction of each protein that spreads to neighbours
    ///   (e.g. 0.2 → 20 % of protein leaves the cell).
    /// - `decay_rate`: fraction of each protein that is removed after diffusion
    ///   (e.g. 0.1 → 10 % loss per tick).
    pub fn tick(&mut self, diffusion_rate: f64, decay_rate: f64) {
        let w = self.width;
        let h = self.height;

        // Snapshot incoming values so diffusion uses the same starting state for
        // every cell (important: we must not read already-modified cells).
        let snapshot: Vec<Cell> = self.cells.clone();

        for y in 0..h {
            for x in 0..w {
                let idx = y * w + x;
                let src = &snapshot[idx];

                // Collect neighbour protein contributions
                let mut r_in = 0.0f64;
                let mut g_in = 0.0f64;
                let mut b_in = 0.0f64;

                let neighbour_coords: [(isize, isize); 4] = [
                    (x as isize, y as isize - 1),
                    (x as isize, y as isize + 1),
                    (x as isize - 1, y as isize),
                    (x as isize + 1, y as isize),
                ];
                for (nx, ny) in neighbour_coords.iter() {
                    if *nx >= 0 && *ny >= 0 && *nx < w as isize && *ny < h as isize {
                        let n = &snapshot[(*ny as usize) * w + *nx as usize];
                        r_in += n.r * diffusion_rate / 4.0;
                        g_in += n.g * diffusion_rate / 4.0;
                        b_in += n.b * diffusion_rate / 4.0;
                    }
                }

                // Protein that stays in this cell (the rest diffuses out and is
                // shared equally among all 4 cardinal directions; out-of-bounds
                // share is discarded, matching the JS engine behaviour).
                let r_stay = src.r * (1.0 - diffusion_rate);
                let g_stay = src.g * (1.0 - diffusion_rate);
                let b_stay = src.b * (1.0 - diffusion_rate);

                let cell = &mut self.cells[idx];
                cell.r = (r_stay + r_in) * (1.0 - decay_rate);
                cell.g = (g_stay + g_in) * (1.0 - decay_rate);
                cell.b = (b_stay + b_in) * (1.0 - decay_rate);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_grid_has_correct_dimensions() {
        let grid = WasmGrid::new(5, 3);
        assert_eq!(grid.width(), 5);
        assert_eq!(grid.height(), 3);
    }

    #[test]
    fn new_grid_cells_start_at_zero() {
        let grid = WasmGrid::new(4, 4);
        for y in 0..4 {
            for x in 0..4 {
                assert_eq!(grid.get_r(x, y), 0.0);
                assert_eq!(grid.get_g(x, y), 0.0);
                assert_eq!(grid.get_b(x, y), 0.0);
            }
        }
    }

    #[test]
    fn randomize_fills_cells_with_values_in_range() {
        let mut grid = WasmGrid::new(5, 5);
        grid.randomize(1);
        let mut all_zero = true;
        for y in 0..5 {
            for x in 0..5 {
                let r = grid.get_r(x, y);
                let g = grid.get_g(x, y);
                let b = grid.get_b(x, y);
                assert!(r >= 0.0 && r <= 255.0, "R out of range: {}", r);
                assert!(g >= 0.0 && g <= 255.0, "G out of range: {}", g);
                assert!(b >= 0.0 && b <= 255.0, "B out of range: {}", b);
                if r > 0.0 || g > 0.0 || b > 0.0 {
                    all_zero = false;
                }
            }
        }
        assert!(!all_zero, "All cells are zero after randomize");
    }

    #[test]
    fn randomize_is_deterministic_with_same_seed() {
        let mut grid1 = WasmGrid::new(4, 4);
        let mut grid2 = WasmGrid::new(4, 4);
        grid1.randomize(99);
        grid2.randomize(99);
        for y in 0..4 {
            for x in 0..4 {
                assert_eq!(grid1.get_r(x, y), grid2.get_r(x, y));
                assert_eq!(grid1.get_g(x, y), grid2.get_g(x, y));
                assert_eq!(grid1.get_b(x, y), grid2.get_b(x, y));
            }
        }
    }

    #[test]
    fn randomize_produces_different_results_with_different_seeds() {
        let mut grid1 = WasmGrid::new(4, 4);
        let mut grid2 = WasmGrid::new(4, 4);
        grid1.randomize(1);
        grid2.randomize(2);
        // At least one cell must differ
        let mut any_different = false;
        for y in 0..4 {
            for x in 0..4 {
                if grid1.get_r(x, y) != grid2.get_r(x, y)
                    || grid1.get_g(x, y) != grid2.get_g(x, y)
                    || grid1.get_b(x, y) != grid2.get_b(x, y)
                {
                    any_different = true;
                    break;
                }
            }
        }
        assert!(any_different, "Different seeds should produce different grids");
    }

    #[test]
    fn tick_decays_proteins_when_no_neighbours() {
        // A 1×1 grid has no neighbours, so all protein just decays.
        let mut grid = WasmGrid::new(1, 1);
        grid.cells[0] = Cell { r: 100.0, g: 200.0, b: 50.0 };
        grid.tick(0.0, 0.1);
        assert!((grid.get_r(0, 0) - 90.0).abs() < 1e-9);
        assert!((grid.get_g(0, 0) - 180.0).abs() < 1e-9);
        assert!((grid.get_b(0, 0) - 45.0).abs() < 1e-9);
    }

    #[test]
    fn get_proteins_flat_has_correct_length() {
        let grid = WasmGrid::new(5, 7);
        assert_eq!(grid.get_proteins_flat().len(), 5 * 7 * 3);
    }

    #[test]
    fn get_proteins_flat_returns_values_in_row_major_order() {
        let mut grid = WasmGrid::new(2, 2);
        // Set each cell to a unique recognizable triple.
        grid.cells[0] = Cell { r: 1.0, g: 2.0, b: 3.0 }; // (x=0, y=0)
        grid.cells[1] = Cell { r: 4.0, g: 5.0, b: 6.0 }; // (x=1, y=0)
        grid.cells[2] = Cell { r: 7.0, g: 8.0, b: 9.0 }; // (x=0, y=1)
        grid.cells[3] = Cell { r: 10.0, g: 11.0, b: 12.0 }; // (x=1, y=1)

        let flat = grid.get_proteins_flat();
        assert_eq!(flat.len(), 12);
        assert_eq!(&flat[0..3], &[1.0, 2.0, 3.0]);
        assert_eq!(&flat[3..6], &[4.0, 5.0, 6.0]);
        assert_eq!(&flat[6..9], &[7.0, 8.0, 9.0]);
        assert_eq!(&flat[9..12], &[10.0, 11.0, 12.0]);
    }

    #[test]
    fn get_proteins_flat_matches_per_cell_accessors() {
        let mut grid = WasmGrid::new(3, 3);
        grid.randomize(42);
        let flat = grid.get_proteins_flat();
        for y in 0..3 {
            for x in 0..3 {
                let idx = (y * 3 + x) * 3;
                assert_eq!(flat[idx],     grid.get_r(x, y));
                assert_eq!(flat[idx + 1], grid.get_g(x, y));
                assert_eq!(flat[idx + 2], grid.get_b(x, y));
            }
        }
    }

    #[test]
    fn get_proteins_flat_reflects_state_after_tick() {
        let mut grid = WasmGrid::new(1, 1);
        grid.cells[0] = Cell { r: 100.0, g: 0.0, b: 0.0 };

        let before = grid.get_proteins_flat();
        assert_eq!(before[0], 100.0);

        // 10 % decay, no diffusion
        grid.tick(0.0, 0.1);
        let after = grid.get_proteins_flat();
        assert!((after[0] - 90.0).abs() < 1e-9, "R should decay to 90, got {}", after[0]);
    }

    #[test]
    fn tick_diffuses_protein_to_neighbour() {
        // 2×1 grid: cell(0,0) has R=100, cell(1,0) has R=0.
        // Each cell always divides its outgoing protein among all 4 cardinal
        // directions; protein headed out-of-bounds is discarded.  In this 2×1
        // grid, each cell has exactly one in-bounds neighbour, so 3 out of 4
        // shares are lost to the boundary.  diffusionRate=0.2, decayRate=0.
        //   cell(0,0): r_stay = 100*(1-0.2) = 80,
        //              r_in from (1,0)       = 0*0.2/4 = 0  → result = 80
        //   cell(1,0): r_stay = 0,
        //              r_in from (0,0)       = 100*0.2/4 = 5 → result = 5
        let mut grid = WasmGrid::new(2, 1);
        grid.cells[0] = Cell { r: 100.0, g: 0.0, b: 0.0 };
        grid.cells[1] = Cell { r: 0.0, g: 0.0, b: 0.0 };
        grid.tick(0.2, 0.0);
        assert!((grid.get_r(0, 0) - 80.0).abs() < 1e-9);
        assert!((grid.get_r(1, 0) - 5.0).abs() < 1e-9);
    }
}
