import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [boardSize, setBoardSize] = useState(8);
  const numPieces = 12
  const [board, setBoard] = useState<Array<Array<string>>>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameTie, setGameTie] = useState(false);
  const [player, setPlayer] = useState('X');
  const [winner, setWinner] = useState('');
  const [turn, setTurn] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<Array<number>>([0, 0]);

  // Initialize board
  useEffect(() => {
    setBoardSize(8);
  }, []);

  useEffect(() => {
    const board: Array<Array<string>> = [];
    for (let i = 0; i < boardSize; i++) {
      board.push([]);
      for (let j = 0; j < boardSize; j++) {
        board[i].push(' ');
      }
    }
    setBoard(board);
  }
  , [boardSize]);

  // Check if game is over
  useEffect(() => {
    if (turn >= boardSize * boardSize) {
      setGameTie(true);
    }
    if (gameWon) {
      setGameOver(true);
    }
  }
  , [gameWon, gameTie, turn, boardSize]);


  // Add spaces and pieces to the checkers board
  useEffect(() => {
    const board: Array<Array<string>> = [];
    for (let i = 0; i < boardSize; i++) {
      board.push([]);
      for (let j = 0; j < boardSize; j++) {
        board[i].push(' ');
        if (i % 2 === 0) {
          if (j % 2 !== 0) {
            board[i][j] = 'B';
          }
        } else {
          if (j % 2 === 0) {
            board[i][j] = 'B';
          }
        }
      }
    }

    // Add player X pieces to the board
    for (let i = 0; i < numPieces; i++) {
      const row = Math.floor((i * 2 + 1 % boardSize) / boardSize);
      const column = Math.floor((i*2) - ((row + 1) / boardSize)) + 1 - row * boardSize + row % 2;
      board[row][column] = 'X';
    }

    // Add player O pieces to the board
    for (let i = 0; i < numPieces; i++) {
      let row = Math.floor((i * 2 + 1 % boardSize) / boardSize);
      const column = Math.floor((i*2) - ((row + 1) / boardSize)) + 1 - row * boardSize + ((row + 1) % 2);
      row = boardSize - row - 1;
      board[row][column] = 'O';
    }

    setBoard(board);
  }
  , [boardSize]);

  // Check if move is capturing
  const isCapturing = (row: number, col: number, player: string) => {
    if (player === 'X') {
      if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] === 'B') {
        return true;
      }
      if (row - 1 >= 0 && col + 1 < boardSize && board[row - 1][col + 1] === 'B') {
        return true;
      }
    } else {
      if (row + 1 < boardSize && col - 1 >= 0 && board[row + 1][col - 1] === 'W') {
        return true;
      }
      if (row + 1 < boardSize && col + 1 < boardSize && board[row + 1][col + 1] === 'W') {
        return true;
      }
    }
    return false;
  }

  // Check if move is valid
  const isValidMove = (row: number, col: number, player: string) => {
    if (player === 'X') {
      if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] === 'B') {
        return true;
      }
      if (row - 1 >= 0 && col + 1 < boardSize && board[row - 1][col + 1] === 'B') {
        return true;
      }
    } else {
      if (row + 1 < boardSize && col - 1 >= 0 && board[row + 1][col - 1] === 'W') {
        return true;
      }
      if (row + 1 < boardSize && col + 1 < boardSize && board[row + 1][col + 1] === 'W') {
        return true;
      }
    }
    return false;
  }

  const handleClick = (i: number, j: number) => {
    if (gameOver || board[i][j] !== ' ') {
      return;
    }
    const boardCopy = [...board];
    boardCopy[i][j] = player;
    setBoard(boardCopy);
    setTurn(turn + 1);
    setPlayer(player === 'X' ? 'O' : 'X');
  }

  const handlePieceClick = (i: number, j: number) => {
    if (gameOver || board[i][j] !== player) {
      return;
    }
    if (board[i][j] === player) {
      setSelectedPiece([i, j]);
    }
  }

  return (
    <div className="App">
      <header>
        <h1>Checkers</h1>
        <h2>{selectedPiece[0]} {selectedPiece[1]}</h2>
        <div>
          {gameOver ? (
            <div>
              <h2>Game Over</h2>
              <h3>{winner} wins!</h3>
            </div> ) : (
            <div>
              <h2>{player}'s turn</h2>
            </div>
            )}
        </div>
      </header>
      <body>
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`cell ${cell}`}
                  onClick={() => handleClick(rowIndex, cellIndex)}
                >
                  <div 
                    className={`piece ${cell}`}
                    onClick={() => handlePieceClick(rowIndex, cellIndex)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

      </body>
    </div>
  );
}

export default App;
