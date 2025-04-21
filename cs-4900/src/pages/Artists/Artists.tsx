// src/pages/Artists.tsx
import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import "./Artists.css";
import { Container, Button } from "react-bootstrap";
import PersonListGrid from "../../components/PersonListGrid.tsx";
import { Helmet } from "react-helmet";
import { Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Artists() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll("artists")
      .then(setArtists)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

        {loading
          ? <p>Loading...</p>
          : <PersonListGrid personList={artists} entity="artists" />
        }
      </Container>
    </div>
  );
}

export default Artists;
