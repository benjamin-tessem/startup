import { Col, Container, Row } from "react-bootstrap";

import Board from "./game";
import Next from "./next";
import Score from "./score";

const Play = () => {
  return (
    <Container
      className="d-flex flex-column flex-grow-1 align-items-center bg-secondary text-light"
      fluid
    >
      <h1>Play</h1>
      <Row
        // Make row take up full height of parent
        style={{ flex: 1, height: "100%" }}
      >
        <Col>
          <Score />
        </Col>
        <Col xs sm="8" lg="8">
          <Board />
        </Col>
        <Col>
          <Next />
        </Col>
      </Row>
    </Container>
  );
};

export default Play;
