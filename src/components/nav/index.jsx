import { Button, Container, Nav, Navbar, Stack } from "react-bootstrap";

import { AuthContext } from "../auth-status";
import { NavLink } from "react-router-dom";
import { useContext } from "react";

const NavBar = () => {
  const { userName, authStatus, logout } = useContext(AuthContext);
  return (
    <header className="w-100">
      <Navbar className="navbar navbar-expand-lg bg-light" expand="lg">
        <Container fluid>
          <NavLink className="navbar-brand" to="/">
            Tetris Rush
          </NavLink>
          {authStatus === "authenticated" && (
            <>
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
                  <div className="text-body-secondary me-auto">{userName}</div>
                  <Button className="ms-auto" onClick={() => logout()}>
                    Logout
                  </Button>
                </Stack>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </header>
  );
};

export default NavBar;
