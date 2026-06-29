# Brave Tic Tac Toe

> A beginner-friendly browser game that lets players enjoy a simple Tic Tac Toe experience in both concept and full game modes.

## Authorship

- Name: Wesley Curtis
- GitHub Profile: [wesleycurtis](https://wesleycurtis.github.io/wesleycurtis/)
- Date: 2026-06-28
- Version: 1.0

## User Story

- **As a** curious beginner gamer and coding student
- **I want** to play a simple Tic Tac Toe game with a clean interface and friendly controls
- **So that** I can practice basic web development concepts while having fun

## Narrative

This project started as a simple practice app for building interactive web pages with HTML, CSS, and JavaScript. It grew into a playful two-part experience where players can try a very simplified concept version or jump into a fuller game with score tracking, guest mode, and a modal-based ending screen.

## About the App

This app is a simple browser-based Tic Tac Toe experience designed as a beginner-friendly web development project. It includes two versions of the game: a very simplified concept mode for learning the basics and a fuller version with player setup, turn-based gameplay, score tracking, guest mode, and a game-over modal. The goal is to make the game easy to understand while showing how HTML, CSS, and JavaScript can work together in a small interactive app.

### Links, Planning, and Ideas

- GitHub Repository: [bravo-tic-tac-toe](https://github.com/wesleycurtis/bravo-tic-tac-toe.git)
- GitHub Profile: [wesleycurtis](https://wesleycurtis.github.io/wesleycurtis/)
- Wireframe / Planning Notes: [Game Wireframe](https://github.com/wesleycurtis/bravo-tic-tac-toe/wiki/Game-Wireframe)
- Future Game Ideas: [Game Ideas](https://github.com/wesleycurtis/bravo-tic-tac-toe/issues/1)

### Project Structure

```text
bravo-tic-tac-toe/
├── index.html
├── concept.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        └── main.js
```

### Tech and Tools

- Visual Studio Code
- Live Server
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- GitHub Pages
- GitHub Repository and README

### Code Snippet

```js
function handleMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    setStatus(`${currentPlayer} wins!`);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(`Next turn: ${currentPlayer}`);
}
```

### Validation and Accessibility

- Local browser preview tested successfully
- VS Code diagnostics reported no errors in the main project files
- Accessibility improvements and Lighthouse review are planned for a future pass

### Sprint 99 / Future Ideas

Milestone: **Sprint 99**

Suggested GitHub issues:

- Add a difficulty selector for the full-game AI
- Add sound effects and animated win states
- Add a scoreboard history panel with saved game results
- Create themed board skins and color variations
