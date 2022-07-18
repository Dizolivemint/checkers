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
  const [selectedPiece, setSelectedPiece] = useState<Array<number>>([-1, -1]);

  // Initialize board
  useEffect(() => {
    setBoardSize(8);
    setPlayer('X');
    setTurn(0);
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
  const isCapturing = (row: number, col: number, player: string, piece: Array<number> = selectedPiece) => {
    const newBoard = [...board];
    if (board[piece[0]][piece[1]] === 'X') {
      if (
        row - piece[0] === 2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2].includes('O'))
      {
        if ((row - piece[0]) / (col - piece[1]) === 1) {
          newBoard[row - 1][col - 1] = ' ';
          setBoard(newBoard);
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === -1) {
          newBoard[row - 1][col + 1] = ' ';
          setBoard(newBoard);
          return true;
        }
      }
    } else if (board[piece[0]][piece[1]] === 'O') {
      if (
        row - piece[0] === -2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2] === 'X')
      {
        if ((row - piece[0]) / (col - piece[1]) === -1) {
          newBoard[row + 1][col - 1] = ' ';
          setBoard(newBoard);
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === 1) {
          newBoard[row + 1][col + 1] = ' ';
          setBoard(newBoard);
          return true;
        }
      }
    } else if (board[piece[0]][piece[1]] === 'OK') {
      if (
        row - piece[0] === 2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2].includes('X'))
      {
        if ((row - piece[0]) / (col - piece[1]) === 1) {
          newBoard[row - 1][col - 1] = ' ';
          setBoard(newBoard);
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === -1) {
          newBoard[row - 1][col + 1] = ' ';
          setBoard(newBoard);
          return true;
        }
      }
    } else {
      if (
        row - piece[0] === -2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2] === 'O')
      {
        if ((row - piece[0]) / (col - piece[1]) === -1) {
          newBoard[row + 1][col - 1] = ' ';
          setBoard(newBoard);
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === 1) {
          newBoard[row + 1][col + 1] = ' ';
          setBoard(newBoard);
          return true;
        }
      }
    }
    return false;
  }

  // Check if can be captured
  const canBeCapturing = (row: number, col: number, piece: Array<number> = selectedPiece) => {
    if (row > boardSize - 1 || col > boardSize - 1 || row < 0 || col < 0) { 
      return false
    }
    if (board[row][col].includes('O') || board[row][col].includes('X')) {
      return false
    }
    if (board[piece[0]][piece[1]] === 'X') {
      if (
        row - piece[0] === 2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2].includes('O'))
      {
        if ((row - piece[0]) / (col - piece[1]) === 1) {
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === -1) {
          return true;
        }
      }
    } else if (board[piece[0]][piece[1]] === 'O') {
      if (
        row - piece[0] === -2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2].includes('X'))
      {
        if ((row - piece[0]) / (col - piece[1]) === -1) {
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === 1) {
          return true;
        }
      }
    } else if (board[piece[0]][piece[1]] === 'OK') {
      if (
        row - piece[0] === 2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2].includes('X'))
      {
        if ((row - piece[0]) / (col - piece[1]) === 1) {
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === -1) {
          return true;
        }
      }
    } else {
      if (
        row - piece[0] === -2 && 
        board[(piece[0] + row) / 2][(piece[1] + col) / 2].includes('O'))
      {
        if ((row - piece[0]) / (col - piece[1]) === -1) {
          return true;
        } else if ((row - piece[0]) / (col - piece[1]) === 1) {
          return true;
        }
      }
    }
    return false;
  }

  // Check if move is valid
  const isValidMove = (row: number, col: number) => {
    if (board[selectedPiece[0]][selectedPiece[1]] === 'X' || board[selectedPiece[0]][selectedPiece[1]] === 'OK') {
      if (row === selectedPiece[0] + 1 && col === selectedPiece[1] + 1 ) return true
      if (row === selectedPiece[0] + 1 && col === selectedPiece[1] - 1 ) return true
    } else if (board[selectedPiece[0]][selectedPiece[1]] === 'O' || board[selectedPiece[0]][selectedPiece[1]] === 'XK') {
      if (row === selectedPiece[0] - 1 && col === selectedPiece[1] + 1 ) return true
      if (row === selectedPiece[0] - 1 && col === selectedPiece[1] - 1 ) return true
    }
    if (isCapturing(row, col, player)) {
      return 'captured'
    } 
    return false;
  }

  const isCapturingPossible = (row: number, col: number) => {
    let newRow = row + 2;
    let newCol = col + 2;
    if (canBeCapturing(newRow, newCol, [row, col])) {
      return true
    }
    newRow = row - 2;
    newCol = col - 2;
    if (canBeCapturing(newRow, newCol, [row, col])) {
      return true
    }
    newRow = row + 2;
    newCol = col - 2;
    if (canBeCapturing(newRow, newCol, [row, col])) {
      return true
    }
    newRow = row - 2;
    newCol = col + 2;
    if (canBeCapturing(newRow, newCol, [row, col])) {
      return true
    }
    return false
  }

  // Check if piece made it to the other side and turn it into a king
  const isKing = (row: number, col: number, player: string) => {
    if (player === 'X') {
      if (row === boardSize - 1) {
        const newBoard = [...board];
        newBoard[row][col] = 'XK';
        setBoard(newBoard);
        return true;
      }
    } else {
      if (row === 0) {
        const newBoard = [...board];
        newBoard[row][col] = 'OK';
        setBoard(newBoard);
        return true;
      }
    }
    return false;
  }


  const handleSpaceClick = (i: number, j: number) => {
    if (
      gameOver || 
      board[i][j] === 'B' || 
      board[i][j].includes('O') || 
      board[i][j].includes('X') || 
      selectedPiece[0] === -1
    ) {
      return;
    }
    const move: boolean | string = isValidMove(i, j)
    if (!move) {
      return
    }  
    const boardCopy = [...board];
    boardCopy[i][j] = boardCopy[selectedPiece[0]][selectedPiece[1]];
    boardCopy[selectedPiece[0]][selectedPiece[1]] = ' ';
    setBoard(boardCopy);
    
    if (move === 'captured') {
      if (isCapturingPossible(i, j)) {
        setSelectedPiece([i, j]);
        return
      }
    }

    isKing(i, j, player)

    setTurn(turn + 1);
    setPlayer(player === 'X' ? 'O' : 'X');
    setSelectedPiece([-1, -1]);
  }



  const handlePieceClick = (i: number, j: number) => {
    if (!gameOver && board[i][j].includes(player)) {
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
                  onClick={() => handleSpaceClick(rowIndex, cellIndex)}
                >
                  <div 
                    className={`piece ${cell} ${selectedPiece[0] === rowIndex && selectedPiece[1] === cellIndex ? 'selected' : ''}`}
                    onClick={() => handlePieceClick(rowIndex, cellIndex)}
                  >
                  </div>
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
