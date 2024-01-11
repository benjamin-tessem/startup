import { useEffect, useRef } from "react";

import { gameLoop } from "./game-loop";

const Game = () => {
  const canvasRef = useRef(null);

  // The main gameplay loop will be played on the canvas, the canvas needs to take up the entire size of the parent,
  // And then within we will render a 1x2 rectangle, where we render a playing field of 10x20 squares

  useEffect(() => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    gameLoop(canvas);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
