window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    const mode1p = document.querySelector('#mode-1p');
    const mode2p = document.querySelector('#mode-2p');
    const scoreXDisplay = document.querySelector('#scoreX');
    const scoreODisplay = document.querySelector('#scoreO');
    const gameModeDisplay = document.querySelector('.game-mode');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let vsCPU = false;
    let scoreX = parseInt(localStorage.getItem('scoreX')) || 0;
    let scoreO = parseInt(localStorage.getItem('scoreO')) || 0;
    scoreXDisplay.textContent = scoreX;
    scoreODisplay.textContent = scoreO;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] === '' || board[b] === '' || board[c] === '') continue;
            if (board[a] === board[b] && board[b] === board[c]) {
                roundWon = true;
                break;
            }
        }
        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            updateScore(currentPlayer);
            isGameActive = false;
            return;
        }
        if (!board.includes('') && !roundWon) {
            announce(TIE);
            isGameActive = false;
        }
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="player0">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerHTML = '<span style="color:#EE9200;">¡Empate!</span>';
                break;
        }
        announcer.classList.remove('hide');
    };

    function updateScore(winner) {
        if (winner === 'X') {
            scoreX++;
            scoreXDisplay.textContent = scoreX;
            localStorage.setItem('scoreX', scoreX);
        } else if (winner === 'O') {
            scoreO++;
            scoreODisplay.textContent = scoreO;
            localStorage.setItem('scoreO', scoreO);
        }
    }

    const isValidAction = (tile) => tile.innerText === '';
    const updateBoard = (index) => board[index] = currentPlayer;

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    };

    const cpuMove = () => {
        const emptyIndices = board
            .map((val, idx) => (val === '' ? idx : null))
            .filter(val => val !== null);
        if (emptyIndices.length === 0 || !isGameActive) return;
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const tile = tiles[randomIndex];
        setTimeout(() => {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(randomIndex);
            handleResultValidation();
            if (isGameActive) changePlayer();
        }, 500);
    };

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            if (isGameActive) {
                changePlayer();
                if (vsCPU && currentPlayer === 'O') cpuMove();
            }
        }
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        if (currentPlayer === 'O') changePlayer();
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX', 'player0');
        });
    };

    function resetScores() {
        scoreX = 0;
        scoreO = 0;
        scoreXDisplay.textContent = 0;
        scoreODisplay.textContent = 0;
        localStorage.removeItem('scoreX');
        localStorage.removeItem('scoreO');
    }

    mode1p.addEventListener('click', () => {
        vsCPU = true;
        gameModeDisplay.textContent = "Modo: 1 Jugador (vs CPU)";
        gameModeDisplay.classList.remove('hide');
        resetScores();
        resetBoard();
    });

    mode2p.addEventListener('click', () => {
        vsCPU = false;
        gameModeDisplay.textContent = "Modo: 2 Jugadores";
        gameModeDisplay.classList.remove('hide');
        resetScores();
        resetBoard();
    });

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});
