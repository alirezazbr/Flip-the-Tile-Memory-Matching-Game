# 🧠 Flip the Tile — Memory Matching Game

A polished, responsive **memory matching game** built with **Next.js, React, and TypeScript**.

The goal is simple: flip two tiles at a time and find all matching pairs before running out of attempts.

## ✨ Features

* 🎮 Classic flip-the-tile memory gameplay
* 🎚️ Multiple difficulty levels
* 🔢 Attempt limits based on difficulty
* 🏆 Score system
* 🎉 Win and loss states
* 🔄 Restart and exit game controls
* 🃏 Smooth 3D tile-flip animations
* 🔊 Optional sound effects
* 💾 High-score persistence using `localStorage`
* 📱 Fully responsive layout
* ♿ Keyboard and accessibility support
* 🎨 Shape-based tile matching instead of relying only on color
* ⚡ Fully client-side — no backend required

## 🎯 Game Rules

The player starts with a board containing pairs of matching tiles.

Each turn:

1. Select the first tile.
2. Select a second tile.
3. The game checks whether both tiles belong to the same pair.
4. If they match:

   * The tiles remain visible.
   * The player receives points.
5. If they don't match:

   * The tiles remain visible briefly.
   * They flip back automatically.
   * The attempt counter increases.
6. The game ends when:

   * All pairs are matched → **Win**
   * The maximum number of attempts is reached → **Loss**

### Final Attempt Rule

If the player's final allowed attempt results in a successful match that completes the board, the player **wins** rather than losing.

## 🎚️ Difficulty Levels

| Difficulty | Board | Tiles | Pairs | Max Attempts |
| ---------- | ----- | ----- | ----- | ------------ |
| Easy       | 2 × 3 | 6     | 3     | 8            |
| Medium     | 4 × 5 | 20    | 10    | 25           |
| Hard       | 6 × 7 | 42    | 21    | 50           |

The difficulty configuration is centralized so additional levels can be added without changing the core game logic.

## 🏆 Scoring

The default scoring system is:

| Action           | Score |
| ---------------- | ----: |
| Successful match |  +100 |
| Mismatch         |   -10 |
| Winning the game |  +500 |

The score cannot go below `0`.

High scores can optionally be stored separately for each difficulty level.

## 🧩 Tile System

Each tile has a unique identifier and belongs to a matching pair.

Example:

```ts
type Tile = {
  id: string;
  pairId: string;
  shape: TileShape;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
};
```

Matching is always performed using `pairId`.

The `id` is unique for every tile and is **never** used to determine whether two tiles match.

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **CSS Modules / project styling system**
* **React Hooks**
* **useReducer** for game state management
* **localStorage** for optional high-score persistence

No backend, database, authentication, or external API is required.

## 📁 Project Structure

A recommended structure:

```text
src/
├── app/
│   └── page.tsx
│
├── components/
│   └── memory-game/
│       ├── MemoryGame.tsx
│       ├── StartScreen.tsx
│       ├── DifficultySelector.tsx
│       ├── Board.tsx
│       ├── Tile.tsx
│       ├── Scoreboard.tsx
│       ├── ControlBar.tsx
│       └── GameResult.tsx
│
├── hooks/
│   └── useMemoryGame.ts
│
├── lib/
│   └── memory-game/
│       ├── config.ts
│       ├── game-utils.ts
│       ├── tile-generator.ts
│       ├── shuffle.ts
│       ├── scoring.ts
│       ├── storage.ts
│       └── sound.ts
│
└── types/
    └── memory-game.ts
```

The actual structure may be adapted to the existing project architecture.

## 🧠 Game State

The core game state contains information such as:

```ts
type GameStatus =
  | "idle"
  | "playing"
  | "checking"
  | "won"
  | "lost";
```

Example state:

```ts
type GameState = {
  status: GameStatus;
  difficulty: Difficulty;
  tiles: Tile[];
  selectedTileIds: string[];
  matchedTileIds: string[];
  attempts: number;
  maxAttempts: number;
  score: number;
  wins: number;
  losses: number;
  soundEnabled: boolean;
};
```

## 🔄 Game Flow

```text
Start Screen
     │
     ▼
Select Difficulty
     │
     ▼
Generate Tiles
     │
     ▼
Shuffle Board
     │
     ▼
Start Game
     │
     ▼
Select Tile #1
     │
     ▼
Select Tile #2
     │
     ▼
Compare pairId
   ┌─┴──────────────┐
   │                │
 Match           Mismatch
   │                │
   ▼                ▼
Keep Visible     Delay
   │                │
   ▼                ▼
Check Win       Flip Back
   │                │
   └───────┬────────┘
           ▼
     Continue Game
           │
      ┌────┴────┐
      ▼         ▼
     Win       Lose
```

## 🎨 Tile Animation

Tiles use a 3D flip animation based on CSS transforms.

The implementation uses concepts such as:

```css
perspective
transform-style: preserve-3d
backface-visibility: hidden
transform: rotateY(180deg)
```

The animation should feel responsive while remaining accessible to users who prefer reduced motion.

## 📱 Responsive Design

The board should work across:

* Desktop
* Laptop
* Tablet
* Mobile

Requirements:

* No horizontal scrolling
* Tiles maintain a consistent aspect ratio
* Board dimensions adapt to the selected difficulty
* The Hard difficulty remains usable on smaller screens
* Touch targets remain sufficiently large
* UI controls remain accessible on mobile

## ♿ Accessibility

The game should support:

* Semantic interactive elements
* Keyboard navigation
* `Enter` and `Space` for tile interaction
* Visible focus states
* Appropriate ARIA labels
* Disabled/non-interactive matched tiles
* Reduced-motion preferences
* Status announcements where appropriate
* Matching information that does not rely exclusively on color

## 🔊 Sound Effects

Sound is optional and can be enabled/disabled by the player.

Potential events:

* Tile flip
* Successful match
* Mismatch
* Game won
* Game lost

Sound should never block gameplay and should not unexpectedly autoplay.

## 💾 High Scores

High scores can be persisted using:

```text
localStorage
```

Suggested storage key:

```text
memory-game-high-scores
```

Scores should be stored independently for each difficulty.

Storage failures or corrupted data should not break the game.

## 🧪 Testing

The game should include tests for the core game logic and important user flows.

### Unit Tests

Test:

* Tile generation
* Pair generation
* Unique tile IDs
* Matching `pairId`s
* Shuffle behavior
* Match detection
* Score calculation
* Win detection
* Loss detection
* Attempt counting
* Final-attempt winning
* Edge cases

### Integration Tests

Test:

* Starting a new game
* Selecting two tiles
* Successful matches
* Mismatches
* Restarting during a mismatch delay
* Exiting during an active game
* Completing the board
* Losing after maximum attempts
* Rapid tile interactions
* Preventing a third tile selection

## 🛡️ Important Edge Cases

The implementation must correctly handle:

* Clicking the same tile twice
* Selecting a third tile while two are being checked
* Clicking an already matched tile
* Rapid repeated clicks
* Restarting while a mismatch timer is active
* Exiting while an animation/timer is active
* Starting a new game before an old asynchronous operation finishes
* Corrupted `localStorage` data
* `localStorage` being unavailable
* Component unmounting while a timer is active

Old timers must never modify the state of a newly started game.

## 🚀 Future Enhancements

Possible future features include:

* ⏱️ Countdown timer
* ⏸️ Pause / Resume
* 🌎 Leaderboard
* 👤 Player profiles
* 🌐 Online multiplayer
* 🎨 Multiple visual themes
* 🃏 Custom tile packs
* 📊 Detailed game statistics
* 🔥 Daily challenges
* 🏅 Achievements
* 📈 Player progression
* 🎵 Background music
* 🎯 Custom difficulty configuration

## 📌 MVP Scope

The initial MVP should focus on:

* [x] Start screen
* [x] Difficulty selection
* [x] Tile generation
* [x] Tile shuffling
* [x] Tile flipping
* [x] Pair matching
* [x] Attempt tracking
* [x] Score calculation
* [x] Win state
* [x] Loss state
* [x] Restart
* [x] Exit to start screen
* [x] Responsive board
* [x] Basic accessibility
* [x] Core tests

Enhancements such as sound, high scores, pause/resume, and advanced statistics can be implemented after the MVP.

## 🧑‍💻 Development Principles

The project should follow these principles:

* TypeScript strict mode
* No unnecessary `any`
* No direct state mutation
* Keep game logic separate from UI
* Prefer pure utility functions for deterministic logic
* Keep components focused and reusable
* Avoid unnecessary dependencies
* Follow the existing project's conventions
* Keep asynchronous timers safe and cancellable
* Avoid unrelated changes to the codebase

## 📜 License

Add the project's license here.

---

Built with ❤️ using **Next.js + React + TypeScript**.
