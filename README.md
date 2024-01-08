# Tetris Rush

## Description deliverable

### Elevator Pitch

Have you ever gotten into an argument with friends, family, or even strangers about who is the best at Tetris? Argue no more, as Tetris Rush is here to solve all of your problems. Tetris Rush is a multiplayer Tetris game that allows you to play against your friends and family to see who is the best at Tetris in an asynchronous way. As you are playing, you can see the score tally of all other players update in real time to see who is in the lead. Tetris Rush is a fun and competitive way to play Tetris with your friends and family. Once everyone has finished playing, you can see the final scores of all players and see who is the best at Tetris.

### Design

![Home Mock](.github/images/home.jpeg)
![Game Mock](.github/images/game.jpeg)
![Leaderboard Mock](.github/images/score.jpeg)

Here is a sequence diagram that shows how players would interact with the backend

![Sequence Diagram](.github/images/network.jpeg)

### Key Features

- Secure login over HTTPS
- Real time score updates
- Leaderboard to see who is the best at Tetris
- Results persist between sessions
- Responsive design that works on mobile and desktop
- Scores locked to prevent cheating, verified by backend

### Technologies

- **HTML** - Uses correct HTML structure for application. Three pages, one for login, one for gameplay, and one for leader board.
- **CSS** - Application styling that looks good on different screen sizes, uses `@media` queries to adjust styling for different screen sizes. Following proper CSS conventions and contrast ratios.
- **JavaScript** - Provides login, gameplay, and leader board functionality. Uses `fetch` to communicate with backend. Manages the canvas for gameplay.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving scores
  - submitting new scores
  - retrieving game state
- **DB/Login** - Store users, scores in database. Register and login users. Credentials securely stored in database. Can't play game without logging in.
- **WebSocket** - As each user plays the game, their score is updated in real time for all other users. When all users have finished playing, the game ends and the final scores are displayed.
- **React** - Application ported to React. Uses React Router to navigate between pages. Uses React Hooks to manage state. Uses React Context to manage global state.
