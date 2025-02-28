import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSong } from "../../services/api";
import SongCard from "../../components/SongCard";
import './SongPage.css';
import { Container, Row, Col } from "react-bootstrap";

function SongPage() {
  const { slug } = useParams();
  const [song, setSong] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const getSong = async () => {
      try {
        const data = await fetchSong(slug);
        setSong(data);
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setLoading(false);
      }
    };

    getSong();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!song) return <p>Song not found</p>;

  return (
    <Container>
      <Row>
        <Col>
          <SongCard song={song} />
        </Col>
        <Col>
          <SongCard song={song} />
        </Col>
        <Col>
          <SongCard song={song} />
        </Col>
      </Row>
      <Row>
        <Col>
          <SongCard song={song} />
        </Col>
        <Col>
          <SongCard song={song} />
        </Col>
        <Col>
          <SongCard song={song} />
        </Col>
      </Row>
    </Container>
  );
}

export default SongPage;