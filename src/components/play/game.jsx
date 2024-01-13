import { Button, Fade } from "react-bootstrap";
import { useCallback, useContext, useEffect, useRef } from "react";

import { AuthContext } from "../auth-status";
import { GameContext } from ".";
import { Game as GameLoop } from "./game-loop";
import { notifier } from "./game-notifier";

const Game = () => {
  const canvasRef = useRef(null);
  const { userName } = useContext(AuthContext);

  const { state, dispatch } = useContext(GameContext);

  // Fun debounce function since the game loop uses requestAnimationFrame, it may call the function multiple times

  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  /**
   * @param {Function} restartCallback
   */
  const postScore = useCallback(
    debounce(async (score, restartCallback) => {
      dispatch({ type: "gameOver", payload: () => restartCallback() });
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: score }),
      });
      if (res.status !== 200) {
        console.error("Error posting score");
      }
    }, 1000),
    [dispatch, debounce]
  );

  const broadcastScore = useCallback(
    debounce((score) => {
      notifier.broadcast(userName, score);
    }, 1000),
    [debounce, state.score]
  );

  // The main gameplay loop will be played on the canvas, the canvas needs to take up the entire size of the parent,
  // And then within we will render a 1x2 rectangle, where we render a playing field of 10x20 squares
  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    const game = new GameLoop(
      canvas,
      (score, restartCallback) => {
        postScore(score, restartCallback);
      },
      (brick) => dispatch({ type: "next", payload: brick }),
      // Updates the score in the state
      (score) => {
        dispatch({ type: "score", payload: score });
        broadcastScore(score);
      },
      (level) => dispatch({ type: "level", payload: level })
    );
    dispatch({ type: "setStartGame", payload: () => {
      console.log("Starting game");
      notifier.broadcast(userName, 0);
      game.start()} });
  }, [broadcastScore, dispatch, postScore]);

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center position-relative">
      {!state.gameStarted && (
        <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
          <Button onClick={() => dispatch({ type: "startGame" })}>
            Start Game
          </Button>
        </div>
      )}

      <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center pe-none">
        <Fade in={state.gameOver}>
          <Button
            variant="light"
            className={state.gameOver && "pe-auto"}
            onClick={() => {
              state?.restartGame();
              dispatch({ type: "restart" });
            }}
          >
            Restart
          </Button>
        </Fade>
      </div>

      {/* Create a restart button that hovers over the game when the game is over */}
      <canvas
        ref={canvasRef}
        width="320"
        height="640"
        className="border border-dark bg-dark"
      ></canvas>
    </div>
  );
};

export default Game;
