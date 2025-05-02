// src/pages/Artists.tsx
import "./Artists.css";
import { Container, Button } from "react-bootstrap";
import PersonListGrid from "../../components/PersonListGrid.tsx";
import { Helmet } from "react-helmet";
import { Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Artists() {
  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Artists - Waveform</title>
      </Helmet>
      <Container>
        <Flex justify="space-between" align="center" className="py-3">
          <h3 className="mb-0 text-capitalize">All Artists</h3>
          <Button variant="primary" onClick={() => navigate("/add-artist")}>
            + Add Artist
          </Button>
        </Flex>
        <PersonListGrid entity="artists" />
      </Container>
    </div>
  );
}

export default Artists;
