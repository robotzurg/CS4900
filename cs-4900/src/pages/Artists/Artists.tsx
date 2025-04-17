import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import "./Artists.css";
import { Container } from "react-bootstrap";
import PersonListGrid from "../../components/PersonListGrid.tsx";
import { Helmet } from "react-helmet";

function Artists() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll("artists")
      .then((data) => setArtists(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
       <Helmet>
          <title>Artists - Waveform</title>
      </Helmet>
      <Container>
        <h3 className="pt-20 pb-20 text-capitalize">All Artists</h3>
        {loading ? <p>Loading...</p> : <PersonListGrid personList={artists} entity="artists" />}
      </Container>
    </div>
  );
}

export default Artists;