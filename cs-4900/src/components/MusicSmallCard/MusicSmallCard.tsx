// src/components/MusicSmallCard.tsx

import { Card, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { getMusicReviews } from "../../services/index";
import { Link, useNavigate } from 'react-router-dom';
import { RingProgress, Text } from '@mantine/core';
import './MusicSmallCard.css';

function MusicSmallCard({ music, entity }: { music: any, entity: any }) {
    const [reviews, setReviews] = useState<any[]>([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (!music.id) return;
        const getReviews = async () => {
            try {
                const reviewData = await getMusicReviews(entity, music.id);
                setReviews(reviewData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        getReviews();
    }, [music.id]);

    let overallAverageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length
        : '-';

    return (
        <Card
            className="music-small-card border-0 shadow p-0"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/${entity}/${music.id}`)}
        >
            <Card.Img variant="top" className={'music-card-top-img'} src={music.image_url} alt={music.name} height={220} />
            <Card.Body>
                <Card.Title className="fw-bold">
                    {music.name}
                </Card.Title>
                <Card.Subtitle className="text-muted" style={{ fontSize: '0.85rem' }}>
                    <Col className="p-0">
                        By{' '}
                        {music.artists && music.artists.length > 0 ? (
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

            {/* DESKTOP RINGS */}
            <div className="rating-ring-container d-none d-sm-none d-lg-flex pt-10 justify-content-center">
              <div className="rating-ring">
                <RingProgress
                  size={55}
                  thickness={6}
                  sections={[{ value: 0, color: 'blue' }]}
                  label={<Text ta="center" className='bold'>-</Text>}
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
                    <Text ta="center" className='bold'>
                      {typeof overallAverageRating === 'number'
                        ? overallAverageRating.toFixed(1).replace(/\.0+$/, '')
                        : overallAverageRating}
                    </Text>
                  }
                />
                <Text className="ring-text">Users</Text>
              </div>

              {/* <div className="rating-ring">
                <RingProgress
                  size={55}
                  thickness={6}
                  sections={[{ value: 0, color: 'green' }]}
                  label={<Text ta="center">-</Text>}
                />
                <Text className="ring-text">Friends</Text>
              </div> */}
            </div>

            {/* MOBILE/TABLET */}
            <div className="rating-ring-container d-flex d-sm-flex d-lg-none pt-10 justify-content-start">
              <div className="d-flex gap-2 rating-ring align-items-center">
                <RingProgress
                  size={30}
                  thickness={2}
                  sections={[{ value: 0, color: 'blue' }]}
                  label={<Text ta="center" className='ring-inner-text'>-</Text>}
                />
                <Text className="ring-text">Critics</Text>
              </div>

              <div className="d-flex gap-2 rating-ring align-items-center">
                <RingProgress
                  size={30}
                  thickness={2}
                  sections={[{
                    value: typeof overallAverageRating === 'number'
                      ? overallAverageRating * 10
                      : 0,
                    color: 'red'
                  }]}
                  label={
                    <Text ta="center" className='ring-inner-text bold'>
                      {typeof overallAverageRating === 'number'
                        ? overallAverageRating.toFixed(1).replace(/\.0+$/, '')
                        : overallAverageRating}
                    </Text>
                  }
                />
                <Text className="ring-text">Users</Text>
              </div>

              {/* <div className="rating-ring">
                <RingProgress
                  size={55}
                  thickness={6}
                  sections={[{ value: 0, color: 'green' }]}
                  label={<Text ta="center">-</Text>}
                />
                <Text className="ring-text">Friends</Text>
              </div> */}
            </div>
          </Col>
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default MusicSmallCard;
