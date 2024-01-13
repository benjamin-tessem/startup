import { Card, ListGroup, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";

import { notifier } from "./game-notifier";

const Score = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      // Sort greatest to least, make sure we are dealing with an array
      if (e.length === 0 || !Array.isArray(e)) return setScores([]);
      const sorted = e.toSorted((a, b) => b.value - a.value);
      setScores(sorted);
    };
    notifier.subscribe(handler);

    return () => {
      notifier.unsubscribe(handler);
    };
  });

  return (
    <Stack
      direction="column"
      className="gap-2 w-100 h-100 justify-content-center"
    >
      <Card>
        <Card.Body>
          <Card.Title>Live Scores</Card.Title>
          <ListGroup>
            {scores.map((score) => (
              <ListGroup.Item key={score.from}>
                {score.from}: {score.value}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Stack>
  );
};

export default Score;
