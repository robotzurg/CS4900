import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBySlug } from "../../services/api";
import { Container, Row, Col } from "react-bootstrap";

import MainNavbar from "../../components/MainNavbar";
import './Song.css';

function SongPage() {
  const { slug } = useParams();
  const [song, setSong] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const getSong = async () => {
      try {
        const data = await fetchBySlug('songs', slug);
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
    <div>
      <MainNavbar />
      <Container className="mt-4 main-container">
        <Row className="d-flex p-3">
          {/* Song Info Section (Left) */}
          <Col lg={8}>
            <h1>{song.name}</h1>
            <h3>
              <strong>By:</strong> {song.artists.map((artist: any, index: number) => (
                <span key={index}>
                <Link className="artist-link" to={`/artist/${artist.name}`}>
                  {artist.name}
                </Link>
                {index < song.artists.length - 1 && ', '}
              </span>
              ))}
            </h3>
            <p>
              <strong>Release Date:</strong> {new Date(song.release_date).toLocaleDateString()}
            </p>
          </Col>

          {/* Song Image Section (Right) */}
          <Col lg={4} className="text-center">
            <img
              src={song.image_url}
              alt={song.name}
              style={{ maxWidth: '100%', borderRadius: '10px' }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SongPage;
