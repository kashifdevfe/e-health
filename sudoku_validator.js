const grid1 = [
    [2, 3, 1],
    [1, 2, 3],
    [3, 1, 2]
];
const grid2 = [
    [1, 2, 3],
    [3, 2, 1],
    [3, 1, 2]
];
const grid3 = [
    [2, 2, 3],
    [3, 1, 2],
    [2, 3, 1]
];
const grid4 = [
    [1]
];
const grid5 = [
    [-1, -2, -3],
    [-2, -3, -1],
    [-3, -1, -2]
];
const grid6 = [
    [1, 3, 3],
    [3, 1, 2],
    [2, 3, 1]
];
const grid7 = [
    [1, 2, 3, 4],
    [4, 3, 2, 1],
    [1, 3, 2, 4],
    [4, 2, 3, 1]
];
const grid8 = [
    [0, 3],
    [3, 0]
];
const grid9 = [
    [0, 1],
    [1, 0]
];
const grid10 = [
    [1, 1, 6],
    [1, 6, 1],
    [6, 1, 1]
];
const grid11 = [
    [1, 2, 3, 4],
    [2, 3, 1, 4],
    [3, 1, 2, 4],
    [4, 2, 3, 1]
];
const grid12 = [
    [-1, -2, 12, 1],
    [12, -1, 1, -2],
    [-2, 1, -1, 12],
    [1, 12, -2, -1]
];
const grid13 = [
    [2, 3, 3],
    [1, 2, 1],
    [3, 1, 2]
];
const grid14 = [
    [1, 3],
    [3, 1]
];
const grid15 = [
    [2, 3],
    [3, 2]
];
const grid16 = [
    [1, 2],
    [2, 2]
];
const grid17 = [
    [2, 3, 1],
    [1, 2, 3],
    [2, 3, 1]
];
const grid18 = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 1],
    [3, 4, 5, 6, 7, 8, 9, 10, 1, 2],
    [4, 5, 6, 7, 8, 9, 10, 1, 2, 3],
    [5, 6, 7, 8, 9, 10, 1, 2, 3, 4],
    [6, 7, 8, 9, 10, 1, 2, 3, 4, 5],
    [7, 8, 9, 10, 1, 2, 3, 4, 5, 6],
    [8, 9, 10, 1, 2, 3, 4, 5, 6, 7],
    [9, 10, 1, 2, 3, 4, 5, 6, 7, 8],
    [10, 1, 2, 3, 4, 5, 6, 7, 8, 9]
];
const grid19 = [
    [1, 3, 3, 4, 3, 6, 7, 8, 10, 10],
    [3, 3, 4, 3, 6, 7, 8, 10, 10, 1],
    [3, 4, 3, 6, 7, 8, 10, 10, 1, 3],
    [4, 3, 6, 7, 8, 10, 10, 1, 3, 3],
    [3, 6, 7, 8, 10, 10, 1, 3, 3, 4],
    [6, 7, 8, 10, 10, 1, 3, 3, 4, 3],
    [7, 8, 10, 10, 1, 3, 3, 4, 3, 6],
    [8, 10, 10, 1, 3, 3, 4, 3, 6, 7],
    [10, 10, 1, 3, 3, 4, 3, 6, 7, 8],
    [10, 1, 3, 3, 4, 3, 6, 7, 8, 10]
];

function validateSudoku(grid) {
    const N = grid.length;
    if (N === 0) return false;

    // Helper to check if a set matches 1..N
    function isValidSet(s) {
        if (s.size !== N) return false;
        for (let i = 1; i <= N; i++) {
            if (!s.has(i)) return false;
        }
        return true;
    }

    // Check rows
    for (let r = 0; r < N; r++) {
        const rowSet = new Set(grid[r]);
        if (!isValidSet(rowSet)) return false;
    }

    // Check columns
    for (let c = 0; c < N; c++) {
        const colSet = new Set();
        for (let r = 0; r < N; r++) {
            colSet.add(grid[r][c]);
        }
        if (!isValidSet(colSet)) return false;
    }

    return true;
}

console.log("grid1:", validateSudoku(grid1), "Expected: true");
console.log("grid2:", validateSudoku(grid2), "Expected: false");
console.log("grid3:", validateSudoku(grid3), "Expected: false");
console.log("grid4:", validateSudoku(grid4), "Expected: true");
console.log("grid5:", validateSudoku(grid5), "Expected: false");
console.log("grid6:", validateSudoku(grid6), "Expected: false");
console.log("grid7:", validateSudoku(grid7), "Expected: false");
console.log("grid8:", validateSudoku(grid8), "Expected: false");
console.log("grid9:", validateSudoku(grid9), "Expected: false");
console.log("grid10:", validateSudoku(grid10), "Expected: false");
console.log("grid11:", validateSudoku(grid11), "Expected: false");
console.log("grid12:", validateSudoku(grid12), "Expected: false");
console.log("grid13:", validateSudoku(grid13), "Expected: false");
console.log("grid14:", validateSudoku(grid14), "Expected: false");
console.log("grid15:", validateSudoku(grid15), "Expected: false");
console.log("grid16:", validateSudoku(grid16), "Expected: false");
console.log("grid17:", validateSudoku(grid17), "Expected: false");
console.log("grid18:", validateSudoku(grid18), "Expected: true");
console.log("grid19:", validateSudoku(grid19), "Expected: false");
