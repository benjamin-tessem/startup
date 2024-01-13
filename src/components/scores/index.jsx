import { Container, Stack, Table, Toast } from "react-bootstrap";
import { useEffect, useState } from "react";
const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      const response = await fetch("/api/scores");
      if (response.ok) {
        const scores = await response.json();
        setScores(scores);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    fetchScores();
  }, []);
  return (
    <Stack className="justify-content-center align-items-center bg-secondary position-relative">
      <Container>
        <Stack gap={2}>
          <h1 className="text-center text-light">Top Scores</h1>
          {loading && <div className="text-center text-light">Loading...</div>}
          <Table bordered hover>
            <caption className="d-none">Top Scores</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Score</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores?.map((score, index) => (
                <tr key={score._id}>
                  <td>{index + 1}</td>
                  <td>{score.username}</td>
                  <td>{score.score}</td>
                  <td>{new Date(score.date).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      </Container>

      <Toast
        className="position-absolute top-0 end-0 m-3"
        onClose={() => setError(false)}
        show={error}
        bg="danger"
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Failed to fetch results.</Toast.Body>
      </Toast>
    </Stack>
  );
};

export default Scores;
