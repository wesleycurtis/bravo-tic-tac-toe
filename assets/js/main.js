let board = Array(9).fill("");
let gameActive = false;
let playerName = "Guest";
let scoreState = { wins: 0, losses: 0, draws: 0 };
let leaderboard = [];
let currentMode = "full";
let currentPlayer = "X";

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function init() {
  currentMode = document.body.dataset.mode || "full";
  loadState();
  renderBoard();
  updateGreeting();
  renderScoreboard();
  updateUserInfo();
  if (document.getElementById("nameInput")) {
    document.getElementById("nameInput").focus();
  }
}

function startGame() {
  const input = document.getElementById("nameInput");
  playerName = (input?.value || "").trim() || generateGuestName();
  if (input) input.value = playerName;

  gameActive = true;
  board = Array(9).fill("");
  currentPlayer = "X";
  renderBoard();
  updateGreeting();

  if (currentMode === "concept") {
    setStatus("Simple mode is on. X goes first.");
  } else {
    setStatus(`New round ready — ${playerName} is X and AI is O.`);
  }

  updateUserInfo();
}

function guestMode() {
  const input = document.getElementById("nameInput");
  if (input) input.value = "";
  startGame();
}

function handleMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    if (currentMode === "concept") {
      gameActive = false;
      setStatus(`${currentPlayer} wins!`);
      showModal(`${currentPlayer} wins!`);
      updateUserInfo();
      return;
    }

    endGame(`${playerName} wins!`, "win");
    return;
  }

  if (isDraw()) {
    if (currentMode === "concept") {
      gameActive = false;
      setStatus("It is a draw.");
      showModal("It is a draw.");
      updateUserInfo();
      return;
    }

    endGame("It is a draw.", "draw");
    return;
  }

  if (currentMode === "concept") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    setStatus(`Next turn: ${currentPlayer}`);
  } else {
    aiMove();
  }
}

function aiMove() {
  if (!gameActive) return;

  const bestMove = pickBestMove();
  if (bestMove === null) return;

  board[bestMove] = "O";
  renderBoard();

  if (checkWin("O")) {
    endGame("AI wins!", "loss");
  } else if (isDraw()) {
    endGame("It is a draw.", "draw");
  }
}

function pickBestMove() {
  const winningMove = findWinningMove("O");
  if (winningMove !== null) return winningMove;

  const blockMove = findWinningMove("X");
  if (blockMove !== null) return blockMove;

  if (board[4] === "") return 4;

  const corners = [0, 2, 6, 8].filter((i) => board[i] === "");
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  return board.findIndex((cell) => cell === "");
}

function findWinningMove(symbol) {
  for (const combo of winningCombos) {
    const values = combo.map((index) => board[index]);
    const emptyIndex = combo.find((index) => board[index] === "");
    if (values.filter((value) => value === symbol).length === 2 && emptyIndex !== undefined) {
      return emptyIndex;
    }
  }
  return null;
}

function checkWin(symbol) {
  return winningCombos.some((combo) => combo.every((index) => board[index] === symbol));
}

function isDraw() {
  return board.every((cell) => cell !== "");
}

function endGame(message, result) {
  gameActive = false;
  setStatus(message);
  updateScore(result);
  showModal(message);
  updateUserInfo();
}

function resetGame() {
  board = Array(9).fill("");
  gameActive = false;
  currentPlayer = "X";
  renderBoard();

  if (currentMode === "concept") {
    setStatus("Round reset. X goes first again.");
  } else {
    setStatus("Round reset. Press Start to play again.");
  }

  updateUserInfo();
}

function hint() {
  alert("A good first move is the center or a corner.");
}

function renderBoard() {
  const boardDiv = document.getElementById("board");
  if (!boardDiv) return;

  boardDiv.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("button");
    div.className = "cell";
    div.type = "button";
    div.textContent = cell;
    div.setAttribute("aria-label", `Cell ${index + 1}`);
    div.onclick = () => handleMove(index);
    boardDiv.appendChild(div);
  });
}

function updateGreeting() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;
  if (currentMode === "concept") {
    greeting.textContent = playerName ? `Hello ${playerName}! This is a simple starter game.` : "Hello there!";
  } else {
    greeting.textContent = playerName ? `Hello ${playerName}, welcome to the full game.` : "Welcome!";
  }
}

function setStatus(message) {
  const status = document.getElementById("status");
  if (status) status.textContent = message;
}

function updateUserInfo() {
  const info = document.getElementById("userInfo");
  if (!info) return;

  const now = new Date();
  info.innerHTML = `
    <strong>Name:</strong> ${playerName}<br>
    <strong>Mode:</strong> ${currentMode === "concept" ? "Concept" : "Full"}<br>
    <strong>Time:</strong> ${now.toLocaleString()}<br>
    <strong>Browser:</strong> ${navigator.userAgent.slice(0, 48)}...
  `;
}

function renderScoreboard() {
  const scoreboard = document.getElementById("scoreboard");
  const leaderboardList = document.getElementById("leaderboard");

  if (scoreboard) {
    scoreboard.innerHTML = `
      <strong>Wins:</strong> ${scoreState.wins}<br>
      <strong>Losses:</strong> ${scoreState.losses}<br>
      <strong>Draws:</strong> ${scoreState.draws}
    `;
  }

  if (leaderboardList) {
    leaderboardList.innerHTML = leaderboard.length
      ? leaderboard.map((entry) => `<li>${entry.name}: ${entry.score}</li>`).join("")
      : "<li>No scores yet.</li>";
  }
}

function updateScore(result) {
  if (result === "win") scoreState.wins += 1;
  if (result === "loss") scoreState.losses += 1;
  if (result === "draw") scoreState.draws += 1;

  addEntryToLeaderboard(playerName, result);
  saveState();
  renderScoreboard();
}

function addEntryToLeaderboard(name, result) {
  const scoreValue = result === "win" ? 3 : result === "draw" ? 1 : 0;
  const existing = leaderboard.find((entry) => entry.name === name);
  if (existing) {
    existing.score += scoreValue;
  } else {
    leaderboard.push({ name, score: scoreValue });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  saveState();
}

function loadState() {
  const saved = sessionStorage.getItem("ticTacToeState");
  if (!saved) {
    leaderboard = [
      { name: "Ava", score: 8 },
      { name: "Milo", score: 5 },
      { name: "Zoe", score: 3 }
    ];
    saveState();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    scoreState = parsed.scoreState || { wins: 0, losses: 0, draws: 0 };
    leaderboard = parsed.leaderboard || [];
    playerName = parsed.playerName || "Guest";
  } catch (error) {
    console.warn("Could not load saved game state", error);
  }
}

function saveState() {
  const payload = { scoreState, leaderboard, playerName };
  sessionStorage.setItem("ticTacToeState", JSON.stringify(payload));
}

function showModal(message) {
  const modalText = document.getElementById("modalText");
  if (modalText) modalText.textContent = `${message}\nCurrent record: ${scoreState.wins}W / ${scoreState.losses}L / ${scoreState.draws}D`;

  const modal = document.getElementById("gameModal");
  if (window.bootstrap && modal) {
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }
}

function generateGuestName() {
  const names = ["Guest-Alpha", "Guest-Beta", "Guest-Gamma", "Guest-Delta", "Guest-Epsilon"];
  return names[Math.floor(Math.random() * names.length)];
}

function cheatMode() {
  console.log("Cheat mode active.");
  console.log("Board:", board);
  console.log("Scores:", scoreState);
  console.log("Leaderboard:", leaderboard);
}

window.addEventListener("DOMContentLoaded", init);