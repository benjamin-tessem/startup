import { Card, ListGroup, Stack } from "react-bootstrap";

const Score = () => {
  return (
    <Stack
      direction="column"
      className="gap-2 w-100 h-100 justify-content-center"
    >
      <Card>
        <Card.Body>
          <Card.Title>Live Scores</Card.Title>
          <ListGroup>
            <ListGroup.Item>Player 1: 0</ListGroup.Item>
            <ListGroup.Item>Player 2: 0</ListGroup.Item>
            <ListGroup.Item>Player 3: 0</ListGroup.Item>
            <ListGroup.Item>Player 4: 0</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Stack>
  );
};

export default Score;
