import { useEffect, useRef } from "react";

import { Game as GameLoop } from "./game-loop";

const Game = () => {
  const canvasRef = useRef(null);

  // The main gameplay loop will be played on the canvas, the canvas needs to take up the entire size of the parent,
  // And then within we will render a 1x2 rectangle, where we render a playing field of 10x20 squares

  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    const game = new GameLoop(
      canvas,
      () => console.log("game over"),
      (brick) => console.log(brick),
      (score) => console.log(score)
    );
    game.start();
  }, []);

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center position-relative">
      {/* Create a restart button that hovers over the game when the game is over */}

      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Game;
