import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Flex, RingProgress, Text, Stack } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify, faSoundcloud, faApple, faYoutube } from '@fortawesome/free-brands-svg-icons'
import CreateReviewModal from './CreateReviewModal';
import { addReview, fetchMe, getMusicReviews, updateReview } from '../services';

function MusicInfoCard({ music, userReview, averageRating }: { music: any, userReview: any[], averageRating: number }) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleCreateReview = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleReviewSubmit = async (rating: number | null, reviewText: string, favorite: boolean) => {
    if (!user) return;  

    const isAlbum = music.category === "album";
    const musicEntityKey = isAlbum ? "album_id" : "song_id";

    const existingReview = await getMusicReviews(music.id, music.type, ["userId", user.id]);

    if (existingReview) {
      await updateReview({
        id: existingReview.id,
        user_id: user.id,
        [musicEntityKey]: music.id,
        timestamp: new Date().toISOString().split('T')[0],
        favorited: favorite,
        rating: rating,
        review_text: reviewText,
      });
    } else {
      await addReview({
        user_id: user.id,
        [musicEntityKey]: music.id,
        timestamp: new Date().toISOString().split('T')[0],
        favorited: favorite,
        rating: rating,
        review_text: reviewText,
      });
    }

    window.location.reload();
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await fetchMe();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

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
                    <Link className="artist-link" to={`/artists/${artist.id}`}>
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
              {user ? <Button className='mt-40' style={{ width: "50%" }} onClick={handleCreateReview}>{userReview.length > 0 ? `Edit Review` : `Add A Review`}</Button> : null}
            </Col>
          </Col>
          <Col lg={6} className="d-flex flex-column align-items-center justify-content-center rating-circles">
              <Flex gap="10">
                <Stack gap="0">
                  <RingProgress
                    size={110}
                    sections={[{ value: 60, color: 'blue' }]}
                    label={<Text ta="center">6</Text>}
                  />
                  <Text ta="center">Critic</Text>
                </Stack>
                <Stack gap="0" align="center">
                  <RingProgress
                    size={110}
                    sections={[{ value: averageRating * 10, color: 'red' }]}
                    label={<Text ta="center">{averageRating.toFixed(1).toString().replace(/\.0+$/, '')}</Text>}
                  />
                  <Text ta="center">User</Text>
                </Stack>
                <Stack gap="0">
                  <RingProgress
                    size={110}
                    sections={[{ value: 90, color: 'green' }]}
                    label={<Text ta="center">9</Text>}
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
        <CreateReviewModal show={showModal} handleClose={handleCloseModal} onSubmit={handleReviewSubmit} existingReview={userReview.length > 0 ? userReview[0] : null} />
      </Container>
  );
}

export default MusicInfoCard;
