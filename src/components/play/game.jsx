import { useContext, useEffect, useRef } from "react";

import { Button } from "react-bootstrap";
import { GameContext } from ".";
import { Game as GameLoop } from "./game-loop";

const Game = () => {
  const canvasRef = useRef(null);

  const { state, dispatch } = useContext(GameContext);

  // The main gameplay loop will be played on the canvas, the canvas needs to take up the entire size of the parent,
  // And then within we will render a 1x2 rectangle, where we render a playing field of 10x20 squares
  console.log(state);
  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    const game = new GameLoop(
      canvas,
      (callBack) => dispatch({ type: "gameOver", payload: () => callBack() }),
      (brick) => dispatch({ type: "next", payload: brick }),
      (score) => dispatch({ type: "score", payload: score }),
      (level) => dispatch({ type: "level", payload: level })
    );
    game.start();
  }, [dispatch]);

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center position-relative">
      {state.gameOver && (
        <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
          <Button
            variant="outline-light"
            onClick={() => {
              state?.restartGame();
              dispatch({ type: "restart" });
            }}
          >
            Restart
          </Button>
        </div>
      )}
      {/* Create a restart button that hovers over the game when the game is over */}
      <canvas ref={canvasRef} width="320" height="640"></canvas>
    </div>
  );
};

export default Game;
