import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { AuthProvider, Footer, MainView, NavBar } from "./components";

import { BrowserRouter } from "react-router-dom";
import { Stack } from "react-bootstrap";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Stack
          className="min-vh-100 max-full-width justify-content-between"
          direction="column"
        >
          <NavBar />

          <MainView />

          <Footer />
        </Stack>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
