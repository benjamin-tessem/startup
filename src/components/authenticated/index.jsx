import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";

import { AuthContext } from "../auth-status";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Authenticated = () => {
  const { logout, userName } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Stack className="justify-content-center align-items-center bg-secondary position-relative">
      <Container>
        <Row className="justify-content-md-center w-full">
          <Col xs lg="4">
            <Card>
              <Card.Body>
                <Stack gap={2} className="text-center">
                  <Card.Title>Welcome To Tetris Rush</Card.Title>

                  <h3 className="text-primary">{userName}</h3>

                  <Container>
                    <Stack
                      direction="horizontal"
                      gap={3}
                      className="justify-content-center align-items-center"
                    >
                      <Button
                        onClick={() => navigate("/play")}
                        variant="primary"
                      >
                        Play
                      </Button>
                      <Button onClick={() => logout()} variant="secondary">
                        Logout
                      </Button>
                    </Stack>
                  </Container>
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Stack>
  );
};

export default Authenticated;
