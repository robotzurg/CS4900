import { Card, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { fetchById, getMusicReviews } from "../../services/index";
import { Link, useNavigate } from 'react-router-dom';
import { Flex, RingProgress, Text } from '@mantine/core';
import './MusicSmallCard.css';

function MusicSmallCard({ musicId, entity }: { musicId: any, entity: any }) {
    const [music, setMusic] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (!musicId) return;

        const getMusic = async (entity: any) => {
            try {
                const data = await fetchById(entity, musicId);
                setMusic(data);
            } catch (error) {
                console.error("Error fetching music:", error);
            } finally {
                setLoading(false);
            }
        };

        getMusic(entity);
    }, [musicId]);

    useEffect(() => {
        if (!musicId) return;
        const getReviews = async () => {
            try {
                const reviewData = await getMusicReviews(entity, musicId);
                setReviews(reviewData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        getReviews();
    }, [musicId]);

    if (loading) return <p>Loading...</p>;
    if (!music) return <p>Music not found</p>;
    if (!music.artists) return <p>Music not found</p>;

    let overallAverageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length
        : '-';

    return (
        <Card
            className="music-small-card border-0 shadow p-0"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/${entity}/${musicId}`)}
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
                        <Flex gap="5" pt="10" justify="center" className='rating-ring-container'>
                            <div className='rating-ring'>
                                <RingProgress
                                    size={55}
                                    thickness={6}
                                    sections={[{ value: 0, color: 'blue' }]}
                                    label={<Text ta="center">-</Text>}
                                    className='ring-circle'
                                />
                                <Text className="ring-text">Critics</Text>
                            </div>
                            <div className='rating-ring'>
                                <RingProgress
                                    size={55}
                                    thickness={6}
                                    sections={[{ value: (typeof overallAverageRating === 'number' ? parseFloat(overallAverageRating.toString()) * 10 : 0), color: 'red' }]}
                                    label={
                                        <Text ta="center">
                                            {typeof overallAverageRating === 'number' ? overallAverageRating.toFixed(1).replace(/\.0+$/, '') : overallAverageRating}
                                        </Text>
                                    }
                                    className='ring-circle'
                                />
                                <Text className='ring-text'>Users</Text>
                            </div>
                            <div className='rating-ring'>
                                <RingProgress
                                    size={55}
                                    thickness={6}
                                    sections={[{ value: 0, color: 'green' }]}
                                    label={<Text ta="center">-</Text>}
                                    className='ring-circle'
                                />
                                <Text className='ring-text'>Friends</Text>
                            </div>
                        </Flex>
                    </Col>
                </Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

export default MusicSmallCard;
