import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const Connect4 = AirComponent('connect-four', function() {
  const [board, setBoard] = createState(Array(6).fill().map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = createState(1);
  const [gameOver, setGameOver] = createState(false);
  const [winner, setWinner] = createState(null);
  gameOver.onUpdate(e=>console.log("gamestate updated, game over?: ", gameOver))
  const theme = {
    colors: {
      player1: '#ff4d4d',
      player2: '#33ccff',
      background: '#f0f8ff',
      boardBackground: '#ffffff',
      boardBorder: '#c0c0c0'
    },
    fontSize: '24pt',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    pieceSize: 50,
    rowGap: 10,
    columnGap: 10
  };

  const styles = {
    container: airCss({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.padding,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow
    }),
    board: airCss({
      display: 'grid',
      gridTemplateRows: `repeat(6, ${theme.pieceSize}px)`,
      gridTemplateColumns: `repeat(7, ${theme.pieceSize}px)`,
      rowGap: `${theme.rowGap}px`,
      columnGap: `${theme.columnGap}px`,
      backgroundColor: theme.colors.boardBackground,
      border: `2px solid ${theme.colors.boardBorder}`,
      borderRadius: theme.borderRadius,
      padding: theme.padding
    }),
    cell: airCss({
      width: `${theme.pieceSize}px`,
      height: `${theme.pieceSize}px`,
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease-in-out',
      '__hover': {
        backgroundColor: currentPlayer === 1 ? theme.colors.player1 : theme.colors.player2,
        opacity: 0.5
      }
    }),
    piece: airCss({
      width: `${theme.pieceSize}px`,
      height: `${theme.pieceSize}px`,
      borderRadius: '50%',
      backgroundColor: (player) => player === 1 ? theme.colors.player1 : theme.colors.player2,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.5s ease-in-out',
      '__hover': {
        transform: 'scale(1.1)'
      }
    }),
    message: airCss({
      fontSize: theme.fontSize,
      marginTop: theme.padding,
      color: (player) => player === 1 ? theme.colors.player1 : theme.colors.player2,
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
    }),
    resetButton: airCss({
      fontSize: '18pt',
      padding: '10px 20px',
      marginTop: theme.padding,
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: theme.borderRadius,
      cursor: 'pointer',
      transition: 'background-color 0.3s ease-in-out',
      '&:hover': {
        backgroundColor: '#c0c0c0'
      }
    })
  };

  const checkWin = (row, col, player) => {
    // Check horizontal
    let count = 0;
    for (let c = 0; c < 7; c++) {
      if (board[row][c] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }

    // Check vertical
    count = 0;
    for (let r = 0; r < 6; r++) {
      if (board[r][col] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }

    // Check diagonal (top-left to bottom-right)
    let startRow = row - Math.min(row, col);
    let startCol = col - Math.min(row, col);
    count = 0;
    while (startRow < 6 && startCol < 7) {
      if (board[startRow][startCol] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
      startRow++;
      startCol++;
    }

    // Check diagonal (top-right to bottom-left)
    startRow = row - Math.min(row, 6 - col);
    startCol = col + Math.min(row, 6 - col);
    count = 0;
    while (startRow < 6 && startCol >= 0) {
      if (board[startRow][startCol] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
      startRow++;
      startCol--;
    }

    return false;
  };
  currentPlayer.onUpdate(e=>console.log("current player: ", e))
  const makeMove = (col) => {
    if (gameOver()) return;
    console.log("move: ", col)
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        if (checkWin(row, col, currentPlayer)) {
          setGameOver(true);
          setWinner(currentPlayer);
        } else if (board.every(row => row.every(cell => cell !== null))) {
          setGameOver(true);
          setWinner(null);
        } else {
            console.log("switching player from: ", currentPlayer() === 1 ? 2 : 1)
          setCurrentPlayer(currentPlayer() === 1 ? 2 : 1);
        }

        break;
      }
    }
  };
  board.onUpdate(e=>console.log("set board state: ", e))
  const resetGame = () => {

    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setCurrentPlayer(1);
    setGameOver(false);
    console.log("game: ", gameOver())
    setWinner(null);
    console.log("win: ", winner())
  };

  return () => html`
    <div style="${styles.container}">
      <h1>Connect 4</h1>
      <div style="${styles.board}">
        ${board.map((row, rowIndex) => row.map((cell, colIndex) => html`
          <div 
            style="${styles.cell}"
            onclick="${() => makeMove(colIndex)}"
          >
            ${cell !== null && html`
              <div style="${styles.piece(cell)}"></div>
            `}
          </div>
        `))}
      </div>
      ${gameOver ? html`
        <div style="${styles.message}">
          ${winner !== null ? `Player ${winner} wins!` : "It's a draw!"}
        </div>
      ` : html`
        <div style="${styles.message}">Player ${currentPlayer}'s turn</div>
      `}
      <button style="${styles.resetButton}" onclick="${resetGame}">Reset Game</button>
    </div>
  `;
});