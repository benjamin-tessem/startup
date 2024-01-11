import { useEffect, useRef } from "react";

import { Container } from "react-bootstrap";

const Game = () => {
  const canvasRef = useRef(null);

  // The main gameplay loop will be played on the canvas, the canvas needs to take up the entire size of the parent,
  // And then within we will render a 1x2 rectangle, where we render a playing field of 10x20 squares

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Fill the parents height
    canvas.height = canvas.parentElement.clientHeight;
    // Fill the parents width
    canvas.width = canvas.parentElement.clientWidth;

    // Set the canvas to be centered
    canvas.style.margin = "auto";
    canvas.style.display = "block";
    // Draw a rectangle
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Game;
