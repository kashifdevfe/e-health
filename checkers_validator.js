const start_1 = ["R", "_", "B", "B"];
const end_1 = ["B", "_", "B", "R"];

const start_2 = ["R", "R", "_", "_"];
const end_2 = ["_", "_", "R", "R"];

const start_3 = ["R", "B", "_"];
const end_3 = ["B", "R", "_"];

const start_4 = ["_", "B", "B"];
const end_4 = ["B", "B", "_"];

const start_5 = ["R", "R", "B"];
const end_5 = ["B", "R", "_"];

const start_6 = ["_", "R", "_"];
const end_6 = ["B", "R", "_"];

const start_7 = ["B", "_", "R"];
const end_7 = ["R", "_", "B"];

const start_8 = ["_", "R", "R", "B"];
const end_8 = ["B", "R", "R", "_"];

const start_9 = ["R", "_", "_", "B"];
const end_9 = ["R", "B", "_", "_"];

function validMoves(start, end) {
    // Quick check for degenerate cases: counts of R and B must match
    const count = (arr, val) => arr.filter(x => x === val).length;
    if (count(start, 'R') !== count(end, 'R') || count(start, 'B') !== count(end, 'B')) {
        return [];
    }

    const startStr = JSON.stringify(start);
    const endStr = JSON.stringify(end);

    if (startStr === endStr) {
        return [start];
    }

    const queue = [[start, [start]]];
    const visited = new Set();
    visited.add(startStr);

    while (queue.length > 0) {
        const [current, path] = queue.shift();

        if (JSON.stringify(current) === endStr) {
            return path;
        }

        const moves = getNextMoves(current);
        for (const move of moves) {
            const moveStr = JSON.stringify(move);
            if (!visited.has(moveStr)) {
                visited.add(moveStr);
                queue.push([move, [...path, move]]);
            }
        }
    }

    return [];
}

function getNextMoves(board) {
    const moves = [];
    const n = board.length;

    for (let i = 0; i < n; i++) {
        if (board[i] === 'R') {
            // Move right 1
            if (i + 1 < n && board[i + 1] === '_') {
                const newBoard = [...board];
                newBoard[i] = '_';
                newBoard[i + 1] = 'R';
                moves.push(newBoard);
            }
            // Jump right over B
            if (i + 2 < n && board[i + 1] === 'B' && board[i + 2] === '_') {
                const newBoard = [...board];
                newBoard[i] = '_';
                newBoard[i + 2] = 'R';
                moves.push(newBoard);
            }
        } else if (board[i] === 'B') {
            // Move left 1
            if (i - 1 >= 0 && board[i - 1] === '_') {
                const newBoard = [...board];
                newBoard[i] = '_';
                newBoard[i - 1] = 'B';
                moves.push(newBoard);
            }
            // Jump left over R
            if (i - 2 >= 0 && board[i - 1] === 'R' && board[i - 2] === '_') {
                const newBoard = [...board];
                newBoard[i] = '_';
                newBoard[i - 2] = 'B';
                moves.push(newBoard);
            }
        }
    }
    return moves;
}

// Helper to format output for readability
function formatOutput(result) {
    if (result.length === 0) return "[]";
    if (result.length > 10) return `[... ${result.length} steps ...]`; // Truncate long paths for display
    return JSON.stringify(result).replace(/],/g, "],\n ");
}

console.log("validMoves(start_1, end_1):");
console.log(formatOutput(validMoves(start_1, end_1)));
console.log("\nvalidMoves(start_2, end_2):");
console.log(formatOutput(validMoves(start_2, end_2)));
console.log("\nvalidMoves(start_3, end_3):", formatOutput(validMoves(start_3, end_3)));
console.log("\nvalidMoves(start_4, end_4):", formatOutput(validMoves(start_4, end_4)));
console.log("\nvalidMoves(start_5, end_5):", formatOutput(validMoves(start_5, end_5)));
console.log("\nvalidMoves(start_6, end_6):", formatOutput(validMoves(start_6, end_6)));
console.log("\nvalidMoves(start_7, end_7):", formatOutput(validMoves(start_7, end_7)));
console.log("\nvalidMoves(start_8, end_8):", formatOutput(validMoves(start_8, end_8)));
console.log("\nvalidMoves(start_9, end_9):");
console.log(formatOutput(validMoves(start_9, end_9)));
