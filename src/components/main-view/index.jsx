import { About, Authenticated, Login, NotFound, Play, Scores } from "..";
import { Route, Routes } from "react-router-dom";

import { AuthContext } from "../auth-status";
import { Stack } from "react-bootstrap";
import { useContext } from "react";

/**
 * Main View Component, houses the Router stack and all views, changing
 * depending on authentication status.
 * @returns JSX Element
 */
const MainView = () => {
  const { authStatus } = useContext(AuthContext);
  return (
    <Stack
      direction="column"
      className="h-100 flex-grow-1"
      id="route-container"
    >
      <Routes>
        {authStatus === "authenticated" && (
          <>
            <Route path="/" element={<Authenticated />} exact />
            <Route path="/play" element={<Play />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}

        {authStatus === "unauthenticated" && (
          <>
            <Route path="/" element={<Login />} exact />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </Stack>
  );
};

export default MainView;
