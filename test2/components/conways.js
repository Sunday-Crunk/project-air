import { AirComponent, createState, html, airCss, onMount, onUnMount } from '../air-js/core/air.js';

export const GlassmorphismConwaysGame = AirComponent('glassmorphism-conways-game', function() {
  const [isRunning, setIsRunning] = createState(false);
  const [generation, setGeneration] = createState(0);
  
  const ROWS = 40;
  const COLS = 60;
  let grid = [];
  let canvas;
  let ctx;
  
  const containerStyle = airCss({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    fontFamily: "'Arial', sans-serif",
    color: '#e2e8f0',
  });
  
  const canvasStyle = airCss({
    borderRadius: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  });
  
  const buttonStyle = airCss({
    padding: '10px 20px',
    margin: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    _hover: {
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    },
  });
  
  const titleStyle = airCss({
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  });
  
  const infoStyle = airCss({
    fontSize: '18px',
    marginTop: '20px',
  });

  const initializeGrid = () => {
    grid = Array(ROWS).fill().map(() => 
      Array(COLS).fill().map(() => Math.random() > 0.7)
    );
    setGeneration(0);
    drawGrid();
  };

  const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (grid[i][j]) {
          ctx.fillStyle = 'rgba(244, 114, 182, 0.8)';
          ctx.shadowColor = 'rgba(244, 114, 182, 0.5)';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(j * 15, i * 15, 14, 14);
      }
    }
  };

  const toggleCell = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / 15);
    const row = Math.floor(y / 15);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      grid[row][col] = !grid[row][col];
      drawGrid();
    }
  };

  const runSimulation = () => {
    const newGrid = grid.map((row, i) =>
      row.map((cell, j) => {
        const neighbors = countNeighbors(i, j);
        if (cell) {
          return neighbors === 2 || neighbors === 3;
        } else {
          return neighbors === 3;
        }
      })
    );
    grid = newGrid;
    drawGrid();
    setGeneration(gen => gen + 1);
  };

  const countNeighbors = (row, col) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = (row + i + ROWS) % ROWS;
        const newCol = (col + j + COLS) % COLS;
        count += grid[newRow][newCol] ? 1 : 0;
      }
    }
    return count;
  };

  onMount(() => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    initializeGrid();
    
    let animationId;
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;
    
    const gameLoop = (currentTime) => {
      animationId = requestAnimationFrame(gameLoop);
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= interval) {
        if (isRunning()) {
          runSimulation();
        }
        lastTime = currentTime - (deltaTime % interval);
      }
    };
    
    gameLoop();
    
    return () => cancelAnimationFrame(animationId);
  });

  return () => html`
    <div style="${containerStyle()}">
      <h1 style="${titleStyle()}">Glassmorphism Conway's Game of Life</h1>
      <canvas 
        id="gameCanvas" 
        width="${COLS * 15}" 
        height="${ROWS * 15}" 
        style="${canvasStyle()}"
        onclick="${toggleCell}"
      ></canvas>
      <div>
        <button style="${buttonStyle()}" onclick="${() => setIsRunning(!isRunning())}">
          ${isRunning() ? 'Stop' : 'Start'}
        </button>
        <button style="${buttonStyle()}" onclick="${initializeGrid}">Reset</button>
      </div>
      <p style="${infoStyle()}">Generation: ${generation()}</p>
    </div>
  `;
});