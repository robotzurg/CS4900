import { Container, Row, Col } from 'react-bootstrap';
import SongSmallCard from './SongSmallCard';

function SongsGrid({ songs }: { songs: any[] }) {
    return (
        <Container>
            <h2 className='pt-20 pb-20'>All Songs</h2>
            <Row className="g-4">
                {songs.map(song => (
                    <Col key={song.id} className='card-col'>
                        <SongSmallCard songId={song.id} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default SongsGrid;