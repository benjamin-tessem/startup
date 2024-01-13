import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Stack,
  Toast,
} from "react-bootstrap";
import { useContext, useState } from "react";

import { AuthContext } from "../auth-status";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastError, setToastError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    await handleNetworkRequest("/api/auth/login");
  };

  const handleRegister = async () => {
    await handleNetworkRequest("/api/auth/register");
  };

  const handleNetworkRequest = async (endpoint) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      login(username);
      navigate("/play");
    } else {
      const error = await response.json();
      setToastError(error?.error ?? "Unknown error");
    }
  };

  return (
    <Stack className="justify-content-center align-items-center bg-secondary position-relative">
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
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  >
                    <Form.Control type="text" placeholder="Username" />
                  </FloatingLabel>
                  <FloatingLabel controlId="password" label="Password">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </FloatingLabel>
                  <Container>
                    <Stack
                      direction="horizontal"
                      gap={3}
                      className="justify-content-center align-items-center"
                    >
                      <Button onClick={handleLogin} variant="primary">
                        Login
                      </Button>
                      <Button onClick={handleRegister} variant="secondary">
                        Register
                      </Button>
                    </Stack>
                  </Container>
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Top Right */}

      <Toast
        className="position-absolute top-0 end-0 m-3"
        onClose={() => setToastError("")}
        show={toastError !== ""}
        bg="danger"
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>{toastError}</Toast.Body>
      </Toast>
    </Stack>
  );
};

export default Login;
