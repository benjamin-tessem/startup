import { Col, Container, Row } from "react-bootstrap";
import { createContext, useMemo, useReducer } from "react";

import Board from "./game";
import Next from "./next";
import Score from "./score";

export const GameContext = createContext({ level: 1 });

const Play = () => {
  // The state should have a state for the score, next brick and if the game has ended, as well as a restart function
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "restart":
          return {
            ...state,
            score: 0,
            next: null,
            gameOver: false,
            restartGame: null,
            level: 1,
          };
        case "gameOver":
          return {
            ...state,
            gameOver: true,
            restartGame: action.payload,
          };
        case "score":
          return {
            ...state,
            score: state.score + action.payload,
          };
        case "next":
          return {
            ...state,
            next: action.payload,
          };
        case "level":
          return {
            ...state,
            level: action.payload,
          };
        default:
          return state;
      }
    },
    {
      score: 0,
      next: null,
      gameOver: false,
    }
  );

  const providerState = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <GameContext.Provider value={providerState}>
      <Container
        className="d-flex flex-column flex-grow-1 align-items-center bg-secondary text-light"
        fluid
      >
        <Row
          // Make row take up full height of parent
          style={{ flex: 1, height: "100%", width: "100%" }}
        >
          <Col>
            <Score />
          </Col>
          <Col xs="12" lg="4" className="py-2">
            <Board />
          </Col>
          <Col>
            <Next />
          </Col>
        </Row>
      </Container>
    </GameContext.Provider>
  );
};

export default Play;
