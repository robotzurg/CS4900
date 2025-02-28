import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBySlug } from "../../services/api";
import { Container, Row, Col } from "react-bootstrap";
import { Flex, RingProgress, Text, Stack } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify, faSoundcloud, faApple, faYoutube } from '@fortawesome/free-brands-svg-icons'

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
        <Row className="p-3 page-header">
          <h1>{song.name}</h1>
          <h3>
            {song.artists.map((artist: any, index: number) => (
              <span key={index}>
              <Link className="artist-link" to={`/artist/${artist.name}`}>
                {artist.name}
              </Link>
              {index < song.artists.length - 1 && ', '}
            </span>
            ))}
          </h3>
        </Row>
        <Row className="d-flex p-3">
            <Col lg={3} className="d-flex flex-column align-items-center">
            <p>
              <strong>Release Date:</strong> {new Date(song.release_date).toLocaleDateString()}<br />
              <strong>Genres:</strong> {song.genres.map((genre: any, index: number) => (
                <span key={index}>
                <Link className="genre-link" to={`/genre/${genre.name}`}>
                  {genre.name}
                </Link>
                {index < song.artists.length - 1 && ', '}
              </span>
              ))}
            </p>
            <Flex gap="5">
              <FontAwesomeIcon icon={faSpotify} size="2x" fixedWidth />
              <FontAwesomeIcon icon={faSoundcloud} size="2x" fixedWidth />
              <FontAwesomeIcon icon={faApple} size="2x" fixedWidth />
              <FontAwesomeIcon icon={faYoutube} size="2x" fixedWidth />
            </Flex>
          </Col>

          <Col lg={5} className="d-flex flex-column align-items-center">
            <h2>Ratings</h2>
            <Flex gap="10">
              <Stack gap="0">
                <RingProgress
                  size={110}
                  sections={[{ value: 90, color: 'blue' }]}
                  label={<Text ta="center">9.0</Text>}
                />
                <Text ta="center">Critic</Text>
              </Stack>
              <Stack gap="0" align="center">
                <RingProgress
                  size={110}
                  sections={[{ value: 82, color: 'red' }]}
                  label={<Text ta="center">8.2</Text>}
                />
                <Text ta="center">User</Text>
              </Stack>
              <Stack gap="0">
                <RingProgress
                  size={110}
                  sections={[{ value: 75, color: 'green' }]}
                  label={<Text ta="center">7.5</Text>}
                />
                <Text ta="center">Friends</Text>
              </Stack>
            </Flex>
          </Col>

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
