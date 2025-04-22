// src/components/MusicSmallCard.tsx

import { Card, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { fetchById, getMusicReviews } from "../../services/index";
import { Link, useNavigate } from 'react-router-dom';
import { Flex, RingProgress, Text } from '@mantine/core';
import './MusicSmallCard.css';

function MusicSmallCard({ musicId, entity }: { musicId: string; entity: string }) {
  const [music, setMusic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!musicId) return;
    fetchById(entity, musicId)
      .then(data => setMusic(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [entity, musicId]);

  useEffect(() => {
    if (!musicId) return;
    getMusicReviews(entity, musicId)
      .then(setReviews)
      .catch(console.error);
  }, [entity, musicId]);

  if (loading) return <p>Loading...</p>;
  if (!music) return <p>Music not found</p>;

  const overallAverageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
      : '-';

  return (
    <Card
      className="music-small-card border-0 shadow p-0"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/${entity}/${musicId}`)}
    >
      <Card.Img
        variant="top"
        className="music-card-top-img"
        src={music.image_url}
        alt={music.name}
      />

      <Card.Body className="justify-content-center">
        <Card.Title className="fw-bold card-title">
          {music.name}
        </Card.Title>

        <Card.Subtitle className="text-muted" style={{ fontSize: '0.85rem' }}>
          <Col className="p-0">
            By{' '}
            {music.artists?.length > 0 ? (
              <Link
                to={`/artists/${music.artists[0].id}`}
                className="artist-link text-muted"
                onClick={e => e.stopPropagation()}
              >
                {music.artists[0].name}
              </Link>
            ) : (
              <span className="text-muted">Unknown Artist</span>
            )}
          </Col>

          <Col>
            <Flex gap="5" pt="10" justify="center" className="rating-ring-container">
              <div className="rating-ring">
                <RingProgress
                  size={55}
                  thickness={6}
                  sections={[{ value: 0, color: 'blue' }]}
                  label={<Text ta="center">-</Text>}
                />
                <Text className="ring-text">Critics</Text>
              </div>

              <div className="rating-ring">
                <RingProgress
                  size={55}
                  thickness={6}
                  sections={[{
                    value: typeof overallAverageRating === 'number'
                      ? overallAverageRating * 10
                      : 0,
                    color: 'red'
                  }]}
                  label={
                    <Text ta="center">
                      {typeof overallAverageRating === 'number'
                        ? overallAverageRating.toFixed(1).replace(/\.0+$/, '')
                        : overallAverageRating}
                    </Text>
                  }
                />
                <Text className="ring-text">Users</Text>
              </div>

              <div className="rating-ring">
                <RingProgress
                  size={55}
                  thickness={6}
                  sections={[{ value: 0, color: 'green' }]}
                  label={<Text ta="center">-</Text>}
                />
                <Text className="ring-text">Friends</Text>
              </div>
            </Flex>
          </Col>
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default MusicSmallCard;
