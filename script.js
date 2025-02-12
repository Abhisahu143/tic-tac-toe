const cells = document.querySelectorAll('.cell');
const modal = document.getElementById('winnerModal');
const modalMessage = document.getElementById('modalMessage');
let board = Array(9).fill(null);
let currentPlayer = '❌';
let gameMode = 'normal';

const setMode = (mode) => {
    gameMode = mode;
    resetGame();
};

const resetGame = () => {
    board = Array(9).fill(null);
    currentPlayer = '❌';
    cells.forEach(cell => cell.textContent = '');
    closeModal();
};

const checkWin = (checkBoard = board) => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (checkBoard[a] && checkBoard[a] === checkBoard[b] && checkBoard[a] === checkBoard[c]) {
            return checkBoard[a];
        }
    }
    return checkBoard.includes(null) ? null : 'tie';
};

const handleClick = (e) => {
    const index = e.target.getAttribute('data-index');
    if (board[index] || checkWin()) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winner = checkWin();
    if (winner) {
        showModal(winner === 'tie' ? "It's a tie!" : `${winner} wins!`);
        return;
    }

    currentPlayer = currentPlayer === '❌' ? 'O' : '❌';

    if (gameMode !== 'multiplayer' && currentPlayer === 'O') {
        computerMove();
    }
};

const computerMove = () => {
    let move;
    switch (gameMode) {
        case 'easy': move = randomMove(); break;
        case 'normal': move = Math.random() > 0.5 ? bestMove() : randomMove(); break;
        case 'hard': move = bestMove(); break;
    }
    if (move !== undefined) {
        board[move] = 'O';
        cells[move].textContent = 'O';
        const winner = checkWin();
        if (winner) showModal(winner === 'tie' ? "It's a tie!" : `${winner} wins!`);
        currentPlayer = '❌';
    }
};

const randomMove = () => {
    const availableMoves = board.map((v, i) => (v === null ? i : null)).filter(i => i !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const bestMove = () => {
    const minimax = (newBoard, player) => {
        const winner = checkWin(newBoard);
        if (winner === '❌') return { score: -1 };
        if (winner === 'O') return { score: 1 };
        if (!newBoard.includes(null)) return { score: 0 };

        let moves = [];
        newBoard.forEach((cell, i) => {
            if (cell === null) {
                const move = { index: i };
                newBoard[i] = player;
                const result = minimax(newBoard, player === 'O' ? '❌' : 'O');
                move.score = result.score;
                newBoard[i] = null;
                moves.push(move);
            }
        });

        return player === 'O'
            ? moves.reduce((best, move) => (move.score > best.score ? move : best))
            : moves.reduce((best, move) => (move.score < best.score ? move : best));
    };

    return minimax(board.slice(), 'O').index;
};

const showModal = (message) => {
    modalMessage.textContent = message;
    modal.style.display = 'flex';
};

const closeModal = () => {
    modal.style.display = 'none';
};

cells.forEach(cell => cell.addEventListener('click', handleClick));
