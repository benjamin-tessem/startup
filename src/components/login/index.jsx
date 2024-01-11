import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Stack,
} from "react-bootstrap";

const Login = () => {
  return (
    <Stack
      className="justify-content-center align-items-center bg-secondary"
    >
      <Container>
        <Row className="justify-content-md-center w-full">
          <Col xs lg="4">
            <Card>
              <Card.Body>
                <Stack gap={2}>
                  <Card.Title>Login</Card.Title>
                  <FloatingLabel
                    controlId="username"
                    label="Username"
                    className="mb-3"
                  >
                    <Form.Control type="text" placeholder="Username" />
                  </FloatingLabel>
                  <FloatingLabel controlId="password" label="Password">
                    <Form.Control type="password" placeholder="Password" />
                  </FloatingLabel>
                  <Container>
                    <Stack
                      direction="horizontal"
                      gap={3}
                      className="justify-content-center align-items-center"
                    >
                      <Button>Login</Button>
                      <Button>Register</Button>
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

export default Login;
