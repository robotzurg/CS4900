import { Card, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { fetchById } from "../services/index";
import { Link } from 'react-router';
import { Flex, RingProgress, Text, Stack } from '@mantine/core';

Flex

function MusicSmallCard({ musicId, entity }: { musicId: any, entity: any }) {
    const [music, setMusic] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p>Loading...</p>;
    if (!music) return <p>Music not found</p>;

    return (
        <Card className="border-0 shadow p-0" style={{ width: "220px"}}>
        <Link to={`/${entity}/${musicId}`} style={{ textDecoration: "none" }}>
        <Card.Img variant="top" src={music.image_url} alt={music.name} />
        <Card.Body>
            <Card.Title className="fw-bold">
                {music.name}
            </Card.Title>
            <Card.Subtitle className="text-muted">
                <Col className='p-0'>
                By&nbsp;
                {music.artists.map((artist: any, index: number) => (
                    <span key={index}>
                        <Link className="artist-link text-muted" to={`/artists/${artist.id}`}>
                            {artist.name}
                        </Link>
                        {index < music.artists.length - 1 && ', '}
                    </span>
                ))}
                </Col>
                <Col>
                    <Flex gap="5" pt="10" justify={'center'}>
                    <Stack gap="0">
                        <RingProgress
                        size={55}
                        thickness={6}
                        sections={[{ value: 90, color: 'blue' }]}
                        label={<Text ta="center">9.0</Text>}
                        />
                        <Text ta="center">Critic</Text>
                    </Stack>
                    <Stack gap="0" align="center">
                        <RingProgress
                        size={55}
                        thickness={6}
                        sections={[{ value: 82, color: 'red' }]}
                        label={<Text ta="center">8.2</Text>}
                        />
                        <Text ta="center">User</Text>
                    </Stack>
                    <Stack gap="0">
                        <RingProgress
                        size={55}
                        thickness={6}
                        sections={[{ value: 75, color: 'green' }]}
                        label={<Text ta="center">7.5</Text>}
                        />
                        <Text ta="center">Friends</Text>
                    </Stack>
                    </Flex>
                </Col>
            </Card.Subtitle>
        </Card.Body>
        </Link>
        </Card>
    );
}

export default MusicSmallCard;