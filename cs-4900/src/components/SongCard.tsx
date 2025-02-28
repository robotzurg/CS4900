import { Card, Container, Row, Col, Image } from 'react-bootstrap';

function SongCard({ song }: { song: any }) {
  return (
    <Container className="my-4">
      <Row className="">
        <Col xs={12}>
        <Card className="shadow-lg rounded-3" style={{ maxWidth: '30%' }}>
            <Card.Body>
                <Row className="align-items-center">
                {/* Text Info Section (8 columns) */}
                <Col xs={12} md={7}>
                    <Card.Title>{song.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                    {song.artists.map((s: any) => s.name).join(', ')}
                    </Card.Subtitle>
                    <Card.Text>
                    Released on: {new Date(song.release_date).toLocaleDateString()}
                    </Card.Text>
                </Col>

                {/* Image Section (4 columns) */}
                <Col xs={12} md={5}>
                    <Image src={song.image_url} alt={song.name} fluid className="rounded" />
                </Col>
                </Row>
            </Card.Body>
        </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SongCard;