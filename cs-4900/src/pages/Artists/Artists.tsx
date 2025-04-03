import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import ArtistListGrid from "../../components/ArtistListGrid.tsx";
import "./Artists.css";
import { Container } from "react-bootstrap";

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
      <Container>
        <h3 className="pt-20 pb-20 text-capitalize">All Artists</h3>
        {loading ? <p>Loading...</p> : <ArtistListGrid artistList={artists} />}
      </Container>
    </div>
  );
}

export default Artists;