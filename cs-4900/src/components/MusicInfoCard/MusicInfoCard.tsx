import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Flex, RingProgress, Text, Modal } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faSoundcloud, faApple, faYoutube } from '@fortawesome/free-brands-svg-icons';
import CreateReviewModal from '../CreateReviewModal';
import { addReview, getMusicReviews, updateReview } from '../../services';
import ReviewListGrid from '../ReviewListGrid';
import './MusicInfoCard.css';

function MusicInfoCard({ music, reviews, userReview }: { music: any; reviews: any[]; userReview: any[] }) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleCreateReview = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const allReviews = [...userReview, ...reviews];
  const averageRating =
    allReviews.length > 0
      ?
        allReviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0) / allReviews.length
      :
        '-';

  const handleReviewSubmit = async (rating: number | null, reviewText: string) => {
    if (!user) return;

    const isAlbum = music.category === 'album';
    const musicEntityKey = isAlbum ? 'album_id' : 'song_id';
    const musicEntityTable = isAlbum ? 'albums' : 'songs';
    const musicType = isAlbum ? 'album' : 'song';

    const existingReview = await getMusicReviews(
      musicEntityTable,
      music.id,
      ['userId', user.id]
    );

    if (existingReview.length !== 0) {
      await updateReview({
        id: existingReview[0].id,
        user_id: user.id,
        [musicEntityKey]: music.id,
        timestamp: new Date().toISOString().split('T')[0],
        rating,
        review_text: reviewText,
        type: musicType,
      });
    } else {
      await addReview({
        user_id: user.id,
        [musicEntityKey]: music.id,
        timestamp: new Date().toISOString().split('T')[0],
        rating,
        review_text: reviewText,
        type: musicType,
      });
    }

    window.location.reload();
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <Container className="mt-1 music-card">
      <Row className="d-flex p-3" style={{ minHeight: '100%' }}>
        <Col xs={12} lg={8}>
          <div className="page-header">
            <h1><strong>{music.name}</strong></h1>
            <h3>
              {music.artists.map((artist: any, index: number) => (
                <Link key={artist.id} className="artist-link" to={`/artists/${artist.id}`}>
                  {artist.name}{index < music.artists.length - 1 && ', '}
                </Link>
              ))}
            </h3>
          </div>
          <p>
            <strong>Release Date:</strong> {new Date(music.release_date).toLocaleDateString()}<br />
            <strong>Genres:</strong> {music.genres.map((genre: any, index: number) => (
              <span key={genre.id}>
                <Link className="genre-link" to={`/genres/${genre.id}`}>{genre.name}</Link>
                {index < music.genres.length - 1 && ', '}
              </span>
            ))}
          </p>
          {user && (
            <Button onClick={handleCreateReview} className="mb-3">
              {userReview.length > 0 ? 'Edit Review' : 'Add A Review'}
            </Button>
          )}

          <Flex align="center" gap="lg" className="ratings-flex">
            {/* Critic Rating */}
            <Flex align="center" gap="sm">
              <RingProgress size={80} thickness={9} sections={[{ value: 0, color: 'blue' }]} label={
                <Text ta="center" size="lg" fw={700} style={{ lineHeight: 1 }}>-</Text>
              } />
              <div>
                <Text fw={700}>Critic Rating</Text>
                <Text size="sm" c="dimmed">Based on 0 reviews</Text>
              </div>
            </Flex>

            {/* User Rating */}
            <Flex align="center" gap="sm">
              <RingProgress
                size={80}
                thickness={9}
                sections={[{ value: typeof averageRating === 'number' ? averageRating * 10 : 0, color: 'red' }]}
                label={
                  <Text ta="center" size="lg" fw={700} style={{ lineHeight: 1 }}>
                    {typeof averageRating === 'number'
                      ? averageRating.toFixed(1).replace(/\.0+$/, '')
                      : averageRating}
                  </Text>
                }
              />
              <div>
                <Text fw={700}>User Rating</Text>
                <Text size="sm" c="dimmed">Based on {reviews.length} reviews</Text>
              </div>
            </Flex>

            {/* Friends Rating */}
            <Flex align="center" gap="sm">
              <RingProgress size={80} thickness={9} sections={[{ value: 0, color: 'green' }]} label={
                <Text ta="center" size="lg" fw={700} style={{ lineHeight: 1 }}>-</Text>
              } />
              <div>
                <Text fw={700}>Friends Rating</Text>
                <Text size="sm" c="dimmed">Based on 0 Reviews</Text>
              </div>
            </Flex>
          </Flex>

          {userReview.length > 0 && <ReviewListGrid type="user_main" reviews={userReview} />}
          <ReviewListGrid reviews={reviews} type="users" />
        </Col>

        <Col xs={12} lg={4} className="d-flex flex-column gap-3 align-items-center">
          <img
            src={music.image_url}
            alt={music.name}
            className="cover-img"
            onClick={() => setImageModalOpen(true)}
          />

          <Flex gap="5">
            <FontAwesomeIcon icon={faSpotify} size="2x" fixedWidth />
            <FontAwesomeIcon icon={faSoundcloud} size="2x" fixedWidth />
            <FontAwesomeIcon icon={faApple} size="2x" fixedWidth />
            <FontAwesomeIcon icon={faYoutube} size="2x" fixedWidth />
          </Flex>

          <div className="sidebar">
            <p>Sidebar content (add later)</p>
          </div>
        </Col>
      </Row>

      <CreateReviewModal
        show={showModal}
        handleClose={handleCloseModal}
        onSubmit={handleReviewSubmit}
        existingReview={userReview.length > 0 ? userReview[0] : null}
      />

      <Modal
        opened={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        centered
        size="auto"
        padding={0}
        radius={0}
        withCloseButton={false}
        zIndex={2000}
      >
        <img
          src={music.image_url}
          alt={music.name}
          style={{ maxWidth: '100%', borderRadius: 0 }}
        />
      </Modal>
    </Container>
  );
}

export default MusicInfoCard;

