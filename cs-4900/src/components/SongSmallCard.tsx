import { Card, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { fetchById } from "../services/api";
import { Link } from 'react-router';
import { Flex, RingProgress, Text, Stack } from '@mantine/core';

function SongSmallCard({ songId }: { songId: any }) {
    const [song, setSong] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!songId) return;

    const getSong = async () => {
        try {
            const data = await fetchById('songs', songId);
            setSong(data);
        } catch (error) {
            console.error("Error fetching song:", error);
        } finally {
            setLoading(false);
        }
    };

    getSong();
    }, [songId]);

    if (loading) return <p>Loading...</p>;
    if (!song) return <p>Song not found</p>;

    return (
        
        <Card className="border-0 shadow p-0" style={{ width: "15rem", maxWidth: "15rem"}}>
        <Link to={`/song/${songId}`} style={{ textDecoration: "none" }}>
        <Card.Img variant="top" src={song.image_url} alt={song.name} />
        <Card.Body>
            <Card.Title className="fw-bold">
                {song.name}
            </Card.Title>
            <Card.Subtitle className="text-muted">
                <Col className='p-0'>
                By&nbsp;
                {song.artists.map((artist: any, index: number) => (
                    <span key={index}>
                        <Link className="artist-link text-muted" to={`/artist/${artist.name}`}>
                            {artist.name}
                        </Link>
                        {index < song.artists.length - 1 && ', '}
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

export default SongSmallCard;