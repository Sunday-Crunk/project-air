import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const NoughtsCrosses = AirComponent('noughts-crosses', function() {
  const [board, setBoard] = createState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = createState('X');
  const [winner, setWinner] = createState(null);

  const theme = {
    colors: {
      xColor: '#F44336', // Red for X
      oColor: '#2196F3', // Blue for O
      boardColor: '#FFFFFF',
      winColor: '#4CAF50' // Green for the winning line
    },
    fontSize: '32pt'
  };

  const styles = {
    board: airCss({
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      margin: '20px',
      width: '300px',
      height: '300px'
    }),
    cell: airCss({
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: theme.fontSize,
      color: '#FFF',
      backgroundColor: theme.colors.boardColor,
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      __hover: {
        backgroundColor: '#e0e0e0'
      }
    }),
    xStyle: airCss({
      color: theme.colors.xColor
    }),
    oStyle: airCss({
      color: theme.colors.oColor
    }),
    winningCell: airCss({
      backgroundColor: theme.colors.winColor,
      animation: 'pulse 1s infinite'
    })
  };

  const checkForWinner = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]  // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        highlightWinner(pattern);
        break;
      }
    }
  };
  console.log("board 1:", board[1])
  const handleCellClick = (index) => {
    if (board[index] || winner) return; // Prevent update if cell is already filled or game is over
    const newBoard = [...board];
    newBoard[index] = currentPlayer();
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    checkForWinner();
  };

  const highlightWinner = (winningIndices) => {
    const updatedBoard = [...board];
    winningIndices.forEach(index => {
      updatedBoard[index] = html`<div style="${styles.winningCell}">${updatedBoard[index]}</div>`;
    });
    setBoard(updatedBoard);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return () => html`
    <div>
      <div style="${styles.board}">
        ${board.map((cell, index) => html`
          <div
            style="${cell === 'X' ? styles.xStyle : cell === 'O' ? styles.oStyle : styles.cell}"
            onclick="${() => handleCellClick(index)}"
          >
            ${cell}
          </div>
        `)}
      </div>
      ${winner ? html`
        <h2>Winner: ${winner}</h2>
        <button onclick="${resetGame}">Restart</button>
      ` : ''}
    </div>
  `;
});

