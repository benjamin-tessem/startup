import { Figure, Spinner, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";

/**
 * Fetches a joke from icanhazdadjoke.com and displays it.
 * @returns
 */
const Quote = () => {
  /**
   * The joke to display. String or null.
   */
  const [joke, setJoke] = useState(null);

  useEffect(() => {
    const getJoke = async () => {
      try {
        const response = await fetch("https://icanhazdadjoke.com/", {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();
        setJoke(data.joke);
      } catch (err) {
        console.error(err);
      }
    };

    getJoke();
  }, []);

  if (!joke) {
    return (
      <Stack className="justify-content-center align-items-center">
        <Spinner animation="border">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Stack>
    );
  }
  return (
    <Figure>
      <Figure.Caption className="blockquote-footer">
        <cite title="Source Title">{joke}</cite>
      </Figure.Caption>
    </Figure>
  );
};

export default Quote;
