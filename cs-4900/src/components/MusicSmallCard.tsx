import { Card, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { fetchById, getMusicReviews } from "../services/index";
import { Link, useNavigate } from 'react-router-dom';
import { Flex, RingProgress, Text, Stack } from '@mantine/core';

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

    const overallAverageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length
        : 0;

    return (
        <Card
            className="border-0 shadow p-0"
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => navigate(`/${entity}/${musicId}`)}
        >
            <Card.Img variant="top" className={'music-card-top-img'} src={music.image_url} alt={music.name} height={220} />
            <Card.Body>
                <Card.Title className="fw-bold">
                    {music.name}
                </Card.Title>
                <Card.Subtitle className="text-muted">
                    <Col className='p-0'>
                        By{" "}
                        {music.artists.map((artist: any, index: number) => (
                            <span key={index}>
                                <Link
                                    to={`/artists/${artist.id}`}
                                    className="artist-link text-muted"
                                    onClick={(e) => e.stopPropagation()} 
                                >
                                    {artist.name}
                                </Link>
                                {index < music.artists.length - 1 && ', '}
                            </span>
                        ))}
                    </Col>
                    <Col>
                        <Flex gap="5" pt="10" justify="center">
                            <Stack gap="0" align="center">
                                <RingProgress
                                    size={55}
                                    thickness={6}
                                    sections={[{ value: 6 * 10, color: 'blue' }]}
                                    label={<Text ta="center">6</Text>}
                                />
                                <Text ta="center">Critic</Text>
                            </Stack>
                            <Stack gap="0" align="center">
                                <RingProgress
                                    size={55}
                                    thickness={6}
                                    sections={[{ value: overallAverageRating * 10, color: 'red' }]}
                                    label={
                                        <Text ta="center">
                                            {overallAverageRating.toFixed(1).replace(/\.0+$/, '')}
                                        </Text>
                                    }
                                />
                                <Text ta="center">User</Text>
                            </Stack>
                            <Stack gap="0" align="center">
                                <RingProgress
                                    size={55}
                                    thickness={6}
                                    sections={[{ value: 9 * 10, color: 'green' }]}
                                    label={<Text ta="center">9</Text>}
                                />
                                <Text ta="center">Friends</Text>
                            </Stack>
                        </Flex>
                    </Col>
                </Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

export default MusicSmallCard;
