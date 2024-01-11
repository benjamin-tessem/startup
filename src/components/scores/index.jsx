import { Container, Stack, Table } from "react-bootstrap";

const Scores = () => {
  return (
    <Stack className="justify-content-center align-items-center bg-secondary">
      <Container>
        <Stack gap={2}>
          <h1 className="text-center text-light">Top Scores</h1>
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
              <tr>
                <td>1</td>
                <td>Jim</td>
                <td>600</td>
                <td>Jan 22, 2024</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Charles</td>
                <td>500</td>
                <td>June 2, 2023</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Alice</td>
                <td>300</td>
                <td>July 3, 2023</td>
              </tr>
            </tbody>
          </Table>
        </Stack>
      </Container>
    </Stack>
  );
};

export default Scores;
