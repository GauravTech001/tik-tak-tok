const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("reset-btn");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0, Draw: 0 };

// Create board cells dynamically
function createBoard() {
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => makeMove(i));
    boardEl.appendChild(cell);
  }
}
createBoard();

// Handle player move
function makeMove(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  updateUI();

  let result = checkGame();
  if (result) {
    endGame(result);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (currentPlayer === "O") {
      setTimeout(computerMove, 400); // slight delay for realism
    }
  }
}

// Computer (AI) move using Minimax
function computerMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  makeMove(move);
}

// Minimax algorithm
function minimax(newBoard, depth, isMaximizing) {
  let result = checkGame();
  if (result) {
    if (result.winner === "X") return -10 + depth;
    else if (result.winner === "O") return 10 - depth;
    else return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Check win or draw
function checkGame() {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of winCombos) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }

  if (board.every(cell => cell)) {
    return { winner: "Draw" };
  }
  return null;
}

// Update UI
function updateUI() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i] ? board[i] : "";
    cell.style.transform = "scale(1)"; // reset scale animation
  });
}

// End game
function endGame(result) {
  gameOver = true;
  if (result.winner === "Draw") {
    scores.Draw++;
    messageEl.textContent = "🤝 It's a Draw!";
  } else {
    scores[result.winner]++;
    messageEl.textContent = `🎉 ${result.winner} Wins!`;
    result.combo.forEach(i => {
      document.querySelectorAll(".cell")[i].classList.add("winner");
    });
  }
  updateScores();
}

// Update scoreboard
function updateScores() {
  document.getElementById("x-score").textContent = scores.X;
  document.getElementById("o-score").textContent = scores.O;
  document.getElementById("draw-score").textContent = scores.Draw;
}

// Reset game
resetBtn.addEventListener("click", () => {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  messageEl.textContent = "";
  createBoard();
});
