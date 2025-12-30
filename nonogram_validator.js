const matrix1 = [
    ['W', 'W', 'W', 'W'],
    ['B', 'W', 'W', 'W'],
    ['B', 'W', 'B', 'B'],
    ['W', 'W', 'B', 'W'],
    ['B', 'B', 'W', 'W']
];
const rows1_1 = [[], [1], [1, 2], [1], [2]];
const columns1_1 = [[2, 1], [1], [2], [1]];

const rows1_2 = [[], [], [1], [1], [1, 1]];
const columns1_2 = [[2], [1], [2], [1]];

const rows1_3 = [[], [1], [3], [1], [2]];
const columns1_3 = [[3], [1], [2], [1]];

const rows1_4 = [[], [1, 1], [1, 2], [1], [2]];
const columns1_4 = [[2, 1], [1], [2], [1]];

const rows1_5 = [[], [1], [1], [1], [2]];
const columns1_5 = [[2, 1], [1], [2], [1]];

const rows1_6 = [[], [1], [1], [1], [2]];
const columns1_6 = [[2, 1], [1], [2], [1]];

const rows1_7 = [[], [1], [1], [1], [2]];
const columns1_7 = [[2, 1], [1], [2], [1]];

const rows1_8 = [[], [1], [1], [1], [2]];
const columns1_8 = [[2, 1], [1], [2], [1]];

const matrix2 = [
    ['W', 'W'],
    ['B', 'B'],
    ['B', 'B'],
    ['W', 'B']
];

const rows2_1 = [[], [2], [2], [1]];
const columns2_1 = [[1, 1], [3]];

const rows2_2 = [[], [2], [2], [1]];
const columns2_2 = [[3], [3]];

const rows2_3 = [[], [], [], []];
const columns2_3 = [[], []];

const rows2_4 = [[], [2], [2], [1]];
const columns2_4 = [[2, 1], [3]];

const rows2_5 = [[], [2], [2], [1]];
const columns2_5 = [[2], [3]];

const rows2_6 = [[], [2], [2], [1]];
const columns2_6 = [[2], [1, 1]];

const matrix3 = [
    ['B', 'W', 'B', 'B', 'W', 'B']
];

const rows3_1 = [[1, 2, 1]];
const columns3_1 = [[1], [], [1], [1], [], [1]];

const rows3_2 = [[1, 2, 2]];
const columns3_2 = [[1], [], [1], [1], [], [1]];

function validateNonogram(matrix, rows, columns) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    // Helper to get runs from a vector
    function getRuns(vector) {
        const runs = [];
        let currentRun = 0;
        for (const cell of vector) {
            if (cell === 'B') {
                currentRun++;
            } else if (currentRun > 0) {
                runs.push(currentRun);
                currentRun = 0;
            }
        }
        if (currentRun > 0) {
            runs.push(currentRun);
        }
        return runs;
    }

    // Check rows
    for (let r = 0; r < numRows; r++) {
        const calculatedRuns = getRuns(matrix[r]);
        const expectedRuns = rows[r];
        if (JSON.stringify(calculatedRuns) !== JSON.stringify(expectedRuns)) {
            return false;
        }
    }

    // Check columns
    for (let c = 0; c < numCols; c++) {
        const colVector = [];
        for (let r = 0; r < numRows; r++) {
            colVector.push(matrix[r][c]);
        }
        const calculatedRuns = getRuns(colVector);
        const expectedRuns = columns[c];
        if (JSON.stringify(calculatedRuns) !== JSON.stringify(expectedRuns)) {
            return false;
        }
    }

    return true;
}

console.log("matrix1, rows1_1, columns1_1:", validateNonogram(matrix1, rows1_1, columns1_1), "Expected: true");
console.log("matrix1, rows1_2, columns1_2:", validateNonogram(matrix1, rows1_2, columns1_2), "Expected: false");
console.log("matrix1, rows1_3, columns1_3:", validateNonogram(matrix1, rows1_3, columns1_3), "Expected: false");
console.log("matrix1, rows1_4, columns1_4:", validateNonogram(matrix1, rows1_4, columns1_4), "Expected: false");
console.log("matrix1, rows1_5, columns1_5:", validateNonogram(matrix1, rows1_5, columns1_5), "Expected: false");
console.log("matrix1, rows1_6, columns1_6:", validateNonogram(matrix1, rows1_6, columns1_6), "Expected: false");
console.log("matrix1, rows1_7, columns1_7:", validateNonogram(matrix1, rows1_7, columns1_7), "Expected: false");
console.log("matrix1, rows1_8, columns1_8:", validateNonogram(matrix1, rows1_8, columns1_8), "Expected: false");
console.log("matrix2, rows2_1, columns2_1:", validateNonogram(matrix2, rows2_1, columns2_1), "Expected: false");
console.log("matrix2, rows2_2, columns2_2:", validateNonogram(matrix2, rows2_2, columns2_2), "Expected: false");
console.log("matrix2, rows2_3, columns2_3:", validateNonogram(matrix2, rows2_3, columns2_3), "Expected: false");
console.log("matrix2, rows2_4, columns2_4:", validateNonogram(matrix2, rows2_4, columns2_4), "Expected: false");
console.log("matrix2, rows2_5, columns2_5:", validateNonogram(matrix2, rows2_5, columns2_5), "Expected: true");
console.log("matrix2, rows2_6, columns2_6:", validateNonogram(matrix2, rows2_6, columns2_6), "Expected: false");
console.log("matrix3, rows3_1, columns3_1:", validateNonogram(matrix3, rows3_1, columns3_1), "Expected: true");
console.log("matrix3, rows3_2, columns3_2:", validateNonogram(matrix3, rows3_2, columns3_2), "Expected: false");
