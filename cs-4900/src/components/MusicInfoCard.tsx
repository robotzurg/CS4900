import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Flex, RingProgress, Text, Stack } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify, faSoundcloud, faApple, faYoutube } from '@fortawesome/free-brands-svg-icons'

function MusicInfoCard({ music }: { music: any }) {
  return (
    <Container className="mt-4 music-card">
        <Row className="d-flex p-3">
          <Col lg={3}>
            <Col className="d-flex flex-column justify-content-center">
              <div className='page-header'>
                <h2><strong>{music.name}</strong></h2>
                <h4>
                  {music.artists.map((artist: any, index: number) => (
                    <span key={index}>
                    <Link className="artist-link" to={`/artist/${artist.id}`}>
                      {artist.name}
                    </Link>
                    {index < music.artists.length - 1 && ', '}
                  </span>
                  ))}
                </h4>
              </div>
              <p>
                <strong>Release Date:</strong> {new Date(music.release_date).toLocaleDateString()}<br />
                <strong>Genres:</strong> {music.genres.map((genre: any, index: number) => (
                  <span key={index}>
                  <Link className="genre-link" to={`/genre/${genre.id}`}>
                    {genre.name}
                  </Link>
                  {index < music.artists.length - 1 && ', '}
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
          </Col>
          <Col lg={6} className="d-flex flex-column align-items-center justify-content-center rating-circles">
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
          <Col lg={3} className="text-center">
            <img
              src={music.image_url}
              alt={music.name}
              style={{ maxWidth: '100%', borderRadius: '10px' }}
            />
          </Col>
        </Row>
      </Container>
  );
}

export default MusicInfoCard;