import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { About, Login, NotFound, Play, Scores } from "./components";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Button, Container, Nav, Navbar, Stack } from "react-bootstrap";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-vh-100 min-vw-100 d-flex flex-column justify-content-between align-items-center bg-light">
        <header className="w-100">
          <Navbar className="navbar navbar-expand-lg bg-light" expand="lg">
            <Container fluid>
              <NavLink className="navbar-brand" to="/">
                Tetris Rush
              </NavLink>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link>
                    <NavLink to="/" className="nav-link">
                      Home
                    </NavLink>
                  </Nav.Link>
                  <Nav.Link>
                    <NavLink to="play" className="nav-link">
                      Play
                    </NavLink>
                  </Nav.Link>
                  <Nav.Link>
                    <NavLink to="scores" className="nav-link">
                      Scores
                    </NavLink>
                  </Nav.Link>
                  <Nav.Link>
                    <NavLink to="about" className="nav-link">
                      About
                    </NavLink>
                  </Nav.Link>
                </Nav>
                <Stack direction="horizontal" gap={2}>
                  <div className="text-body-secondary me-auto">
                    Current User
                  </div>
                  <Button className="ms-auto">Logout</Button>
                </Stack>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/play" element={<Play />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="container-fluid bg-dark text-light d-flex flex-column justify-content-center align-items-center text-light py-2">
          <div>&copy;Ben Tessem</div>
          <a
            href="https://github.com/benjamin-tessem/startup"
            className="text-decoration-none text-light"
          >
            GitHub
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
