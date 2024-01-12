import { Card, Stack } from "react-bootstrap";
import { colors, tetrominos } from "./game-loop";
import { useContext, useEffect, useRef } from "react";

import { GameContext } from ".";

const NextBlock = () => {
  const {
    state: { score, next, level },
  } = useContext(GameContext);

  const canvasRef = useRef(null);

  const nextBlock = tetrominos[next];
  const nextColor = colors[next];

  useEffect(() => {
    if (!canvasRef.current || !nextBlock || !nextColor) return;
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the canvas background color
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Assuming nextBlock is a 2D array representing your tetromino
    const tetrominoWidth = nextBlock[0].length;
    const tetrominoHeight = nextBlock.length;

    // Calculate the starting position to center the tetromino
    const startX = Math.floor((canvas.width - tetrominoWidth * 20) / 2);
    const startY = Math.floor((canvas.height - tetrominoHeight * 20) / 2);

    nextBlock.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = nextColor;

          // Draw the tetromino at the centered position
          ctx.fillRect(startX + x * 20, startY + y * 20, 20 - 1, 20 - 1);
        }
      });
    });
  }, [nextBlock, nextColor]);

  return (
    <Stack
      direction="column"
      className="gap-2 w-100 h-100 justify-content-center"
    >
      <Card>
        <Card.Body>
          <Card.Title>Score: {score}</Card.Title>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Next Block</Card.Title>
          <div className="d-flex justify-content-center align-items-center">
            <canvas ref={canvasRef} width="100" height="100"></canvas>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Level: {level}</Card.Title>
        </Card.Body>
      </Card>
    </Stack>
  );
};

export default NextBlock;
