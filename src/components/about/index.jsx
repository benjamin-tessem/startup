import { Card, Col, Container, Row } from "react-bootstrap";

import Quote from "./quote";

const About = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Card>
            <Card.Img variant="top" src="/tetris.jpg" />
            <Card.Body>
              <Card.Title>About</Card.Title>
              <Card.Text>
                Tetris is a tile-matching puzzle game, where the player must
                rotate and move falling pieces (tetrominoes) that fall faster
                and faster. The game ends when the pieces reach the top of the
                screen. The goal is to get as many points as possible by
                clearing lines of blocks. The more lines cleared at once, the
                more points you get.
              </Card.Text>
              <Card.Text>
                The name Tetris is a registered trademark of The Tetris Company,
                LLC. Our use of the name and the game is for non-profit
                educational use only. No part of this code or program should be
                used outside of that definition.
              </Card.Text>
              <Quote />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
